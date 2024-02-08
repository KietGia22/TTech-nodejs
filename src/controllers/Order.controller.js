const OrderService = require('../services/order.service')
const {StatusCodes} = require('http-status-codes');

const getAllOrders = async(req, res) => {
    res.json(`ala`)
}

const getSingleOrder = async(req, res) => {
    res.json(`ala`)
}

const getCurrentUserOrders = async(req, res) => {
    res.json(`ala`)
}

const CreateOrder = async(req, res) => {
    res.json(`ala`)
}

const UpdateOrder = async(req, res) => {
    res.json(`ala`)
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    CreateOrder,
    UpdateOrder
}