const CartService = require('../services/cart.service')
const {StatusCodes} = require('http-status-codes')

const AddToCart = async(req, res) => {
    try {
        const body = req.body
        const user = req.user
        const {cart} = await CartService.AddToCartService({body, user})
        res.status(StatusCodes.OK).json({cart})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const UpdateQuantity = async(req, res) => {
    try {
        const body = req.body
        const user = req.user
        const {cart, msg} = await CartService.UpdateQuantityService({body, user})
        res.status(StatusCodes.OK).json({cart, msg})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const GetCart = async(req, res) => {
    try {
        const {id: userId} = req.params
        const user = req.user
        const {UserCart} = await CartService.getCartService({userId, user})
        res.status(StatusCodes.OK).json({UserCart})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const RemoveFromCart = async(req, res) => {
    try {
        const body = req.body
        console.log(body)
        const user = req.user
        console.log(user)
        const {msg} = await CartService.RemoveFromCartService({body, user})
        res.status(StatusCodes.OK).json({msg})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const EmptyCart = async(req, res) => {
    try {
        const body = req.body
        const user = req.user
        const {msg} = await CartService.EmptyCartService({body, user})
        res.status(StatusCodes.OK).json(msg)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    AddToCart,
    UpdateQuantity,
    GetCart,
    RemoveFromCart,
    EmptyCart
}
