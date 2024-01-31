const express = require('express');
const router = express.Router();
const {
    authorizePermissions,
    authenticateUser
} = require('../middleware/authentication');

const {
   createProduct, 
    GetAllProducts,
    GetSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/product.controller');

const {getSingleProductReview} = require('../controllers/Review.Controller')


router.route('/')
      .post([authenticateUser, authorizePermissions('admin')], createProduct)
      .get(GetAllProducts)

router.route('/:id')
      .get(GetSingleProduct)
      .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
      .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

router.route('/uploadImage/:id').post([authenticateUser, authorizePermissions('admin')], uploadImage)

router.route('/review/:id').get(getSingleProductReview)

module.exports = router;