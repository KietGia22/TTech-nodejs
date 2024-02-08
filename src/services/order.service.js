const Order = require('../models/Order.model')
const Product = require('../models/Product.model')
const Cart = require('../models/Cart.model')

const CustomError = require('../errors')
const {checkPermissions} = require('../utils')

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const createOrderService = async ({body, user}) => {
    const {shippingFee} = body
    if(!shippingFee)
        throw new CustomError.BadRequestError(`Please provide shipping fee`)

    const cart = await Cart.findOne({
        user: user.userId
    })
    if(!cart)
        throw new CustomError.NotFoundError(`user has not added any products to the shopping cart yet.`)

    let orderItems = []
    let subtotal = 0

    for(const item of cart.products){
        const dbProduct = await Product.findOne({
            _id: item.product
        })
        const {name, price, image, _id, quantity_pr} = dbProduct

        if(item.quantity > quantity_pr)
            throw new CustomError.BadRequestError(`Not enough quantity available for product: ${name}`);
        dbProduct.quantity_pr -= Number(item.quantity)
        await dbProduct.save()

        const SingleOrderItem = {
            quantity: item.quantity,
            name,
            price,
            image,
            product: _id
        }
        orderItems = [...orderItems, SingleOrderItem]
        subtotal += Number(Number(item.quantity) * Number(price))
    }
    const total = Number(Number(shippingFee) + Number(subtotal))
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'vnd'
    });

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: user.userId
    });

    await Cart.deleteOne({
        user: user.userId
    })

    return {order: order, clientSecret: paymentIntent.client_secret}
    
}

const getAllOrdersService = async () => {
    const orders = await Order.find({})

    if(!orders)
        throw new CustomError.BadRequestError(`Still no orders placed.`)
    return {orders: orders}
}

const getSingleOrderService = async({orderId}) => {
    const order = await Order.findOne({_id: orderId})

    if(!order)
        throw new CustomError.NotFoundError(`Not found order with id ${orderId}`)

    return {order: order}
}

const getCurrentUserOrderService = async({userId}) => {
    const orders = await Order.find({user: userId});

    if(!orders)
        throw new CustomError.BadRequestError(`The user has no orders yet or the user was not found`)

    return {orders: orders}
}

const updateOrderService = async({paymentIntentId, user, OrderId}) => {
    const order = await Order.findOne({_id: OrderId})

    if(!order)
        throw new CustomError.NotFoundError(`No order with id : ${OrderId}`);

    checkPermissions(user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()

    return {order: order}
}

module.exports = {
    createOrderService,
    getAllOrdersService,
    getSingleOrderService,
    getCurrentUserOrderService,
    updateOrderService
}