const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const checkImage = require('../middlewares/checkImage')


router.get('/:type/:id', checkImage, (req, res) => {
    let type = req.params.type
    let id = req.params.id
    let pathImage = path.join(__dirname, `../../uploads/${type}/${id}`)
    let defaultImage = path.join(__dirname, '../assets/no-image.jpg')

    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage)
    }
    else{
        res.sendFile(defaultImage)
    }
})

module.exports = router