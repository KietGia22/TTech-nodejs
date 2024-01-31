const User = require('../models/Auth.model')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
} = require('../utils/index')

const registerService = async (body, res) => {
  const { email, name, password } = body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  // const token = createJWT({ payload: tokenUser })

  attachCookiesToResponse({ res, user: tokenUser })
  return { user: tokenUser }
}

const loginService = async (body, res) => {
  const {email, password} = body
  if(!email || !password)
    throw new CustomError.BadRequestError('Please provide email or password')
  
  const user = await User.findOne({ email })
  
  if(!user)
    throw new CustomError.UnauthenticatedError(`${user}`)

  const isPasswordCorrect = await user.comparePassword(password)

  if(!isPasswordCorrect)
    throw new CustomError.UnauthenticatedError(`Sai mat khau roi thang lon`)
    
  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser })

  return {user: tokenUser}
}

module.exports = {
  registerService,
  loginService
}
