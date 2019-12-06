const express = require('express')
const router = express.Router()
const checkAdmin = require('../middlewares/checkAdmin')
const Product = require('../models/product')
const underscore = require('underscore')

router.get('/', (req, res) => {
    let skip = Number(req.query.skip) || 0
    let limit = Number(req.query.limit) || 5
    Product.find({stock: true})
            .sort('name')
            .populate('user', 'name email img')
            .populate('category', 'description')
            .skip(skip)
            .limit(limit)
            .exec((error, products) => {

                if(error){
                    res.status(500).json({
                        ok: false,
                        error
                    })
                }
                else{
                    Product.countDocuments((error, count) =>{
                        if(error){
                            res.status(500).json({
                                ok: false,
                                error
                            })
                        }
                        else{
                            res.json({
                                ok: true,
                                products,
                                count
                            })
                        }
                    })
                    
                }

            })
})

router.get('/:id', (req, res) => {
    let id = req.body.id
    Product.findById(id)
            .populate('user', 'name email img')
            .populate('category', 'nombre')
            .exec((error, product) => {
                if(error){
                    res.status(500).json({
                        ok: false,
                        error
                    })
                }
                else if(!product){
                    res.status(400).json({
                        ok: false,
                        error:{
                            message: 'Product id not found'
                        }
                    })
                }
                else{
                    res.json({
                        ok: true,
                        product
                    })
                }
            })
})

router.get('/search/:term', (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((error, products) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.json({
                ok: true,
                products
            })
        })
});

router.post('/', (req, res) => {
    let product = new Product({
        name: req.body.name,
        unitPrice: req.body.unitPrice,
        description: req.body.description,
        img: req.body.img,
        stock: req.body.stock,
        category: req.body.category,
        user: req.user._id
    })

    product.save((error, product) => {
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }
        else{
            res.status(201).json({
                ok: true,
                product
            })
        }
    })
})

router.put('/:id', (req, res) => {

    let id = req.params.id
    let body = underscore.pick(req.body, ['name', 'unitPrice', 'description', 'img', 'stock', 'category']);


    Product.findByIdAndUpdate(id, body, {new: true}, (error, product) => {
            if(error){
                res.status(500).json({
                    ok: false,
                    error
                })
            }
            else if(!product){
                res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Product not found'
                    }
                })
            }
            else{
                res.json({
                    ok: true,
                    product
                })
            }
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id

    Product.findByIdAndUpdate(id, {stock: false}, {new: true}, (error, product) => {
        if(error){
            res.status(500).json({
                ok: false, 
                error
            })
        }
        else if(!product){
            res.status(400).json({
                ok: false,
                error:{
                    message: 'Product not found'
                }
            })
        }
        else{
            res.json({
                ok: true,
                product,
                message: 'Product deleted'
            })
        }
    })
})

module.exports = router