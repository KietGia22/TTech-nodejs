const express = require('express');
const router = express.Router();
const authRouter = require('./auth.routes')
const UserRouter = require('./user.routes')
const ProductRouter = require('./product.routes')
const CartRouter = require('./cart.routes')
const CategoryRouter = require('./category.routes')
const DiscountRouter = require('./discount.routes')
const OrderRouter = require('./order.routes')
const ReviewRouter = require('./review.routes')
const SupplierRouter = require('./supplier.routes')
const RevenueRouter = require('./renevue.routes')

router.use('/auth', authRouter);
router.use('/users', UserRouter)
router.use('/product', ProductRouter)
router.use('/cart', CartRouter)
router.use('/category', CategoryRouter)
router.use('/discount', DiscountRouter)
router.use('/order', OrderRouter)
router.use('/review', ReviewRouter)
router.use('/supplier', SupplierRouter)
router.use('/renevue', RevenueRouter)

module.exports = router;