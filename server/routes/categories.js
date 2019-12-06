const express = require('express');
const router = express.Router();
const checkAdmin = require('../middlewares/checkAdmin')
const Category = require('../models/category')


/* GET home page. */
router.get('/', (req, res) => {
    let skip = Number(req.query.skip) || 0 
    let limit = Number(req.query.limit) || 5

    Category.find({})
        .sort('description')
        .populate('user', 'name email img')
        .skip(skip)
        .limit(limit)
        .exec((error, categories) => {
            if(error){
                res.status(400).json({
                    ok: false,
                    error
                })
            }
            else{
                Category.countDocuments({}, (error, count) => {
                    if(error){
                        res.status(400).json({
                            ok: false,
                            error
                        })
                    }
                    else{
                        res.json({
                            ok: true,
                            categories,
                            count
                        })
                    }
                })
                
            }
        })

});

router.get('/:id', (req, res) => {
    let id = req.params.id;

    Category.findById(id, (error, category) => {
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }
        else if(!category){
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Category not found'
                }
            })
        }
        else{
            res.json({
                ok: true,
                category
            })
        }
    })
})

router.post('/', (req, res) => {
    let category = new Category({
        description: req.body.description,
        user: req.user._id // checkToken middleware return this object to user
    })

    category.save((error, category)=>{
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }
        else if(!category){
            res.status(500).json({
                ok: false,
                error
            })
        }
        else{
            res.json({
                ok: true,
                category
            })
        }
    })
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let description = req.body.description
    Category.findByIdAndUpdate(id, {description},{new: true}, (error, category ) => {
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }
        else if(!category){
            res.status(400).json({
                ok: false,
                error:{
                    message: 'Category not found'
                }
            })
        }
        else{
            res.json({
                ok: true,
                category
            })
        }
    })
})

router.delete('/:id', checkAdmin, (req, res) => {
    let id = req.params.id
    Category.findByIdAndDelete(id, (error, category) => {
        if(error){
            res.status(500).json({
                ok: false,
                error,
                message: 'ola'
            })
        }
        else if(!category){
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Category not found'
                }
            })
        }
        else{
            res.json({
                ok: true,
                message: 'Category deleted',
                category
            })
        }
    })
} )

module.exports = router