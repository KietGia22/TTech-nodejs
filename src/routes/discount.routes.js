const express = require('express');
const router = express.Router();
const {
    GetDiscountId,
    GetAllDiscounts,
    ShowDiscount,
    UpdateDiscount,
    DeleteDiscount,
    CreateDiscount
} = require('../controllers/Discount.controller')

const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')


router.route('/')
      .get(GetAllDiscounts)
      .post([authenticateUser, authorizePermissions('admin')], CreateDiscount)

router.route('/:id')
      .get(ShowDiscount)
      .patch([authenticateUser, authorizePermissions('admin')], UpdateDiscount)
      .delete([authenticateUser, authorizePermissions('admin')], DeleteDiscount)

router.route('/findname/:name').get(GetDiscountId)

module.exports = router;
