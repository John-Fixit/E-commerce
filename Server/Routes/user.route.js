const express = require('express');
const userRouter = express.Router();
const userController = require('../Controller/user.controller')
userRouter.get('/', userController.getLandingPage)
userRouter.post('/signup', userController.signup)
userRouter.post('/signin', userController.signin)
userRouter.get('/home', userController.home)
userRouter.post('/thisuser', userController.getUser)
userRouter.post('/cart', userController.cartProduct)
userRouter.post('/removeCartItem', userController.removeCartItem)
userRouter.post('/carts', userController.getCart)
userRouter.post('/save', userController.saveProfile)
userRouter.get('/products', userController.product)
module.exports = userRouter