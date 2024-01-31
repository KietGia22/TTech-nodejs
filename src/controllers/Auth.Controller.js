const { StatusCodes } = require('http-status-codes')
const AuthService = require('../services/Auth.service')

const register = async (req, res) => {
  // res.send('register user')
  try {
    const body = req.body
    const { user } = await AuthService.registerService(body, res)
    res.status(StatusCodes.CREATED).json({ user: user })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
  }
}

const login = async (req, res) => {
  try {
    const body = req.body;
    const {user} = await AuthService.loginService(body, res);
    res.status(StatusCodes.OK).json({ user: user })
  
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
  }
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({msg: 'User logged out'});
}

module.exports = {
  register,
  login,
  logout,
}
