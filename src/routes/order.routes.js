const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    CreateOrder,
    UpdateOrder
} = require('../controllers/Order.controller')


router
  .route('/')
  .post(authenticateUser, CreateOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, UpdateOrder);

module.exports = router;