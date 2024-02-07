const Cart = require('../models/Cart.model')
const CustomError = require('../errors')
const Product = require('../models/Product.model')
const {checkPermissions} = require('../utils')

const AddToCartService = async ({body, user}) => {
    checkPermissions(user, body.user)
    try {   
        const product = await Product.findById(body.product).select("_id")

        if(!product)
            throw new CustomError.NotFoundError(`Not found product with id: ${body.product}`)

        const cart = await Cart.findOne({
            user: body.user,
            product: product._id
        })
        if(cart){
            cart.quantity += Number(body.quantity)
            await cart.save()
            return {cart: cart}
        } else if(!cart){
            const Newcart = await Cart.create(body);
            return {cart: Newcart}
        }
    } catch(err) {
        throw err
    }
}

const UpdateQuantityService = async ({body, user}) => {
    checkPermissions(user, body.user)
    try {
        const cart = await Cart.findOne({
            user: body.user,
            product: body.product
        })
        if(cart && body.quantity > 0){
            cart.quantity = Number(body.quantity)
            await cart.save()
            return {cart: cart, msg: `Update successful`}
        } else if(!cart)
            throw new CustomError.NotFoundError(`Cart doesn't exist`)
        else if(body.quantity === 0){
            await cart.deleteOne()
            return {msg: `The product has been removed from the cart`}
        }
    } catch(err) {
        throw err
    }
}

const EmptyCartService = async ({body, user}) => {
    checkPermissions(user, body.user)
    try {   
        const cart = await Cart.find({
            user: body.user
        })
        
        if(!cart)
            throw new CustomError.NotFoundError(`Your cart is currently empty.`)
        
        await Cart.deleteMany({
            user: body.user
        })
        return {msg: `We have cleared your shopping cart.`}
        
    } catch(err) {
        throw err 
    }
}

const getCartService = async ({userId, user}) => {
    checkPermissions(user, userId)
    try {
        const UserCart = await Cart.find({
            user: userId
        }).populate('product')
        return {UserCart: UserCart}

    } catch(err) {
        throw err
    }
}

const RemoveFromCartService = async({body, user})=>{
    checkPermissions(user, body.user)
    try {
        const RemoveItem = await Cart.findOne({
            user: body.user,
            product: body.product
        })

        if(!RemoveItem)
            throw new CustomError.NotFoundError(`Not found product with id ${body.product} in cart`)

        await RemoveItem.deleteOne()

        return {msg: `Removed successfully from cart`}
    } catch(err){
        throw err
    }
}

module.exports = {
    AddToCartService,
    UpdateQuantityService,
    EmptyCartService,
    getCartService,
    RemoveFromCartService
}