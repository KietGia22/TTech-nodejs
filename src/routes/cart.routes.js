const express = require('express');
const router = express.Router();

const {
    AddToCart,
    UpdateQuantity,
    GetCart,
    RemoveFromCart,
    EmptyCart
} = require('../controllers/Cart.controller')

const {
    authenticateUser,
} = require('../middleware/authentication'); 

router.route('/').post(authenticateUser, AddToCart)
                 .patch(authenticateUser, UpdateQuantity)
                 .delete(authenticateUser, EmptyCart)

router.route('/user/:id').get(authenticateUser, GetCart)
                 
router.route('/remove').delete(authenticateUser, RemoveFromCart)

module.exports = router;