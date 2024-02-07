const CustomError = require('../errors')
const {isTokenValid} = require('../utils')

// const auth = async (req, res, next) => {
//   //check header
//   const authHeader = req.headers.authorization
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     throw new UnauthenticatedError('Authentication invalid')
//   }

//   const token = authHeader.split(' ')[1]
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET)
//     const test = payload.userId === '6581bbe91602d5dabb9a73c6'
//     req.user = { userId: payload.userId, name: payload.name, test }
//     next()
//   } catch (error) {
//     throw new UnauthenticatedError('Authentication invalid')
//   }
// }

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if(!token)
    throw new CustomError.UnauthenticatedError('Vui lòng đăng nhập');

  try {
    const {name, userId, role} = isTokenValid({token})
    req.user = {name, userId, role};
    next();
  } catch(err) {
    throw new CustomError.UnauthenticatedError('Không thể xác thực người dùng');
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      throw new CustomError.UnauthorizedError('Bạn không có quyền thực hiện hành động này');
    }
    next();
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions
}