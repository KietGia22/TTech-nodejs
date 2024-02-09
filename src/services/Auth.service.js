const User = require('../models/Auth.model')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  attachCookiesToResponse,
  createTokenUser,
  forgotPasswordEmail
} = require('../utils')

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

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
    throw new CustomError.UnauthenticatedError(`Not exist`)

  const isPasswordCorrect = await user.comparePassword(password)

  if(!isPasswordCorrect)
    throw new CustomError.UnauthenticatedError(`Sai mat khau roi thang lon`)
    
  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser })

  return {user: tokenUser}
}

const forgotPasswordService = async ({email}) => {
  const user = await User.findOne({email});

  if(!email)
      throw new CustomError.BadRequestError('Please provide valid email');
  
  if(!user)
      throw new CustomError.NotFoundError('Not found user');

  const RandomString = generateRandomString(8)
  user.password = RandomString
  console.log(RandomString)
  await user.save()

  await forgotPasswordEmail({
    name: user.name,
    email: user.email,
    newPass: RandomString
  })

  return {msg: 'Please check your email for reset password'}
}

module.exports = {
  registerService,
  loginService,
  forgotPasswordService
}
