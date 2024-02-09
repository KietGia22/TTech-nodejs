const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermissions = require('./checkPermissions')
const CartPermissions = require('./CartPermission')
const forgetPasswordEmail = require('./ForgetPassword')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  CartPermissions,
  forgetPasswordEmail
}
