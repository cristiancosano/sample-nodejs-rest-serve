const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const User = require('../models/user')
const Product = require('../models/product')

router.use(fileUpload({userTempFiles: true}))

router.put('/:type/:id', (req, res) => {
    let type = req.params.type
    let id = req.params.id

    if(!req.files){
        res.status(400).json({
            ok: false,
            error: {
                message: 'Select file first'
            }
        })
    }
    else{
        let file = req.files.file
        let allowedExtensions = ['jpg', 'png', 'gif', 'jpeg']
        let allowedTypes = ['products', 'users']
        let splitName = file.name.split('.')
        let extension =  splitName[splitName.length - 1]

        if(allowedTypes.indexOf(type) < 0){
            res.status(400).json({
                ok: false,
                error: {
                    message: 'The allowed types are: '+allowedTypes.join(', ')
                }
            })
        }
        else if( allowedExtensions.indexOf(extension) < 0 ){
            res.status(400).json({
                ok: false,
                error: {
                    message: 'The allowed extensions are: '+allowedExtensions.join(', ')
                }
            })
        }
        else{
            
            let fileName = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;

            file.mv(`./uploads/${type}/${fileName}`, (error) => {
                if(error){
                    res.status(400).json({
                        ok: false,
                        error
                    })
                }
                else{
                    if(type == 'users') userImage(id, fileName, res)
                    else if(type == 'products') productImage(id, fileName, res)
                }
            })
        }
    }

})

function productImage(id, fileName, res){

    Product.findByIdAndUpdate(id, {img: fileName}, (error, product) => {
        if(error){
            removeFile(fileName, 'products')
            res.status(500).json({
                ok: false,
                error
            })
        }
        else if(!product){
            removeFile(fileName, 'products')
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Product not found'
                }
            })
        }
        else{
            removeFile(product.img, 'products')
            product.img = fileName
            res.json({
                ok: true,
                product,
                message: 'File uploaded'
            })
        }
    })

}

function userImage(id, fileName, res){

    User.findByIdAndUpdate(id, {img: fileName}, (error, user) => {
        if(error){
            removeFile(fileName, 'users')
            res.status(500).json({
                ok: false,
                error
            })
        }
        else if(!user){
            removeFile(fileName, 'users')
            res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            })
        }
        else{
            removeFile(user.img, 'users')
            user.img = fileName
            res.json({
                ok: true,
                user,
                message: 'File uploaded'
            })
        }
    })
}

function removeFile(fileName, type){
    let pathFile = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`)
    if (fs.existsSync(pathFile)){
        fs.unlinkSync(pathFile)
    }
}

module.exports = router