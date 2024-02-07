const CustomError = require('../errors')
const {isTokenValid} = require('../utils')

const authenticateUser = async (req, res, next) => {
   let token
  //check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
  }

  token = authHeader.split(' ')[1]

  //check cookies
  if(req.cookies.token){
    token = req.cookies.token;
  }

  if(!token){
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
//   const token = authHeader.split(' ')[1]
  try {
    const payload = isTokenValid(token);
    // Attach the user and his permissions to the req object
    req.user = { userId: payload.user.userId, name: payload.user.name}
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      throw new CustomError.UnauthorizedError('Unauthorized to access this route');
    }
    next();
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions
}