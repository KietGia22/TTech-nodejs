const express = require('express');
const router = express.Router();
const {
    authorizePermissions,
    authenticateUser
} = require('../middleware/authentication');

const {
    getRevenueByDay,
    getRevenueByYear,
    getTopSellerProduct
} = require('../controllers/Revenue.controller')

router.route('/day').post(authenticateUser, authorizePermissions('admin'), getRevenueByDay)
router.route('/year').post(authenticateUser, authorizePermissions('admin'), getRevenueByYear)
router.route('/topProduct').post(authenticateUser, authorizePermissions('admin'), getTopSellerProduct)


module.exports = router