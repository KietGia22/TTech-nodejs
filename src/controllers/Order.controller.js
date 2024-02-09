const OrderService = require('../services/order.service')
const {StatusCodes} = require('http-status-codes');

const getAllOrders = async(req, res) => {
    try {
        const {orders, total} = await OrderService.getAllOrdersService();
        res.status(StatusCodes.OK).json({total, orders})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const getSingleOrder = async(req, res) => {
    try {
        const {id: orderId} = req.params
        const {order} = await OrderService.getSingleOrderService({orderId})
        res.status(StatusCodes.OK).json({order})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const getCurrentUserOrders = async(req, res) => {
    try {
        const {userId} = req.user
        const {orders} = await OrderService.getAllOrdersService({userId});
        res.status(StatusCodes.OK).json({orders})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const CreateOrder = async(req, res) => {
    try {
        const body = req.body;
        const user = req.user;
        const {order, clientSecret} = await OrderService.createOrderService({body, user})
        res.status(StatusCodes.OK).json({order, clientSecret})
    } catch (err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const UpdateOrder = async(req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const user = req.user;
        const {id: OrderId} = req.params
        const {order} = await OrderService.updateOrderService({paymentIntentId, user, OrderId})
        res.status(StatusCodes.OK).json({order})
    } catch (err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    CreateOrder,
    UpdateOrder
}