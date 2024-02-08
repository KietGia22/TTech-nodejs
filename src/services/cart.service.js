const Cart = require('../models/Cart.model')
const CustomError = require('../errors')
const Product = require('../models/Product.model')
const {CartPermissions} = require('../utils')
const {checkPermissions} = require('../utils')

const AddToCartService = async ({body, user}) => {
    CartPermissions(user, body.user)
    try {   
        let products = [];
        for (const item of body.products) {
            const product = await Product.findById(item.product);
            if (!product)   
                throw new CustomError.NotFoundError(`Not found product with id: ${item._id}`);

            const { _id: productId} = product;
            const cartItem = {
                product: productId,
                quantity: item.quantity
            }
            products = [...products, cartItem];
            
        }

        let cart = await Cart.findOne({
            user: body.user
        })
        .populate({
            path: 'products.product', // Chỉ định trường cần populate và model tương ứng
            model: 'Product'
        })

        if (cart) {
            // cart.products = [...cart.products, ...products];
            for(const item of products){
                const existingProd = cart.products.find(prod => prod.product.equals(item.product))
                if(existingProd)
                    existingProd.quantity += Number(item.quantity)
                else 
                    cart.products = [...cart.products, item]
            }
        } else {
            cart = await Cart.create({
                user: body.user,
                products: products
            });
        }

        await cart.save();
        return { cart: cart };

    } catch(err) {
        throw err
    }
}

const UpdateQuantityService = async ({body, user}) => {
    CartPermissions(user, body.user)
    try {
        const cart = await Cart.findOne({
            user: body.user,
        })
        if(!cart)
            throw new CustomError.NotFoundError(`Cart not found`)
        else {
            for (const item of body.products) {
                const existingProdIndex = cart.products.findIndex(prod => prod.product.equals(item.product));
                if (existingProdIndex === -1)
                    throw new CustomError.NotFoundError(`Not found product with id: ${item.product} in cart`);

                if (item.quantity > 0) {
                    cart.products[existingProdIndex].quantity = item.quantity;
                } else if (item.quantity === 0) {
                    cart.products.splice(existingProdIndex, 1);
                }
            }
        }
        
        await cart.save();
        return {cart: cart}
    } catch(err) {
        throw err
    }
}

const EmptyCartService = async ({body, user}) => {
    CartPermissions(user, body.user)
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
        const UserCart = await Cart.findOne({
            user: userId
        })
        .populate({
            path: 'products.product', // Chỉ định trường cần populate và model tương ứng
            model: 'Product'
        })
        return {UserCart: UserCart}

    } catch(err) {
        throw err
    }
}

const RemoveFromCartService = async({body, user})=>{
    CartPermissions(user, body.user)
    try {
        const cart = await Cart.findOne({
            user: body.user,
        })
        if(!cart)
            throw new CustomError.NotFoundError(`Cart not found`)
        else {
            for (const item of body.products) {
                const existingProdIndex = cart.products.findIndex(prod => prod.product.equals(item.product));
                if (existingProdIndex === -1)
                    throw new CustomError.NotFoundError(`Not found product with id: ${item.product} in cart`);
                cart.products.splice(existingProdIndex, 1);
            }
        }
        
        await cart.save();
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