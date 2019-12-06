const express = require('express')
const router = express.Router();
const usersRoutes = require('./users')
const loginRoutes = require('./login')
const categoriesRoutes = require('./categories')
const productsRoutes = require('./products')
const uploadRoutes = require('./upload')
const imagesRoutes = require('./images')
const checkToken = require('../middlewares/jwt')


router.use('/users', checkToken, usersRoutes)
router.use('/categories', checkToken, categoriesRoutes)
router.use('/products', checkToken, productsRoutes)
router.use('/login', loginRoutes)
router.use('/upload', uploadRoutes)
router.use('/img', imagesRoutes)

module.exports = router;