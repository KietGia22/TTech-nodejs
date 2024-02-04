const express = require('express');
const router = express.Router();
const {
    GetSupplierId,
    GetAllSuppliers,
    ShowSupplier,
    UpdateSupplier,
    DeleteSupplier,
    CreateSupplier
} = require('../controllers/Supplier.controller')

const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')


router.route('/')
      .get(GetAllSuppliers)
      .post([authenticateUser, authorizePermissions('admin')], CreateSupplier)

router.route('/:id')
      .get(ShowSupplier)
      .patch([authenticateUser, authorizePermissions('admin')], UpdateSupplier)
      .delete([authenticateUser, authorizePermissions('admin')], DeleteSupplier)

router.route('/findname/:name').get(GetSupplierId)


module.exports = router;