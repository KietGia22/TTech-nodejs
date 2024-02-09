const express = require('express')
const router = express.Router()

const { register, login, logout, forgetPassword } = require('../controllers/Auth.Controller')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgetPassword);

module.exports = router
