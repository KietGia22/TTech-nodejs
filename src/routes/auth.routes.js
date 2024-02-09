const express = require('express')
const router = express.Router()

const { register, login, logout, forgotPassword } = require('../controllers/Auth.Controller')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword);

module.exports = router
