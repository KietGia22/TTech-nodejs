const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const {
    getAllUsers,
    showCurrentUser,
    getSingleUser,
    updatedCurrentUser,
    updateUserPassword
} = require('../controllers/User.controller')

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/:id').get(authenticateUser, getSingleUser)

router.route('/updateUser').patch(authenticateUser, updatedCurrentUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

module.exports = router;