import express from 'express'
import * as controller from '../controllers/products.controllers.js'

const route = express.Router()

route.get('/products', controller.getProducts)

route.get('/products/nuevo', controller.createProductFormPage)
route.post('/products/nuevo', controller.createProduct)

route.get('/products/:idProduct', controller.getProductById)


export default route