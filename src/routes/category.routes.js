const express = require('express');
const router = express.Router();
const {
    GetCategoryId,
    GetAllCategories,
    ShowCategory,
    UpdateCategory,
    DeleteCategory,
    CreateCategory
} = require('../controllers/Category.controller')

const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')


router.route('/')
      .get(GetAllCategories)
      .post([authenticateUser, authorizePermissions('admin')], CreateCategory)

router.route('/:id')
      .get(ShowCategory)
      .patch([authenticateUser, authorizePermissions('admin')], UpdateCategory)
      .delete([authenticateUser, authorizePermissions('admin')], DeleteCategory)

router.route('/findname/:name').get(GetCategoryId)
    

module.exports = router;