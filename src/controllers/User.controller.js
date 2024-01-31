const UserService = require('../services/user.service')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions
} = require('../utils')


const getAllUsers = async (req, res) => {
    try {
        const { users } = await UserService.getAllUsersService(req.user)
        // console.log(users)
        res.status(StatusCodes.OK).json({users})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const getSingleUser = async (req, res) => {
    try {
        const {user} = await UserService.getSingleUserService(req);
        console.log(user);
        res.status(StatusCodes.OK).json({user})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const updatedCurrentUser = async (req,res) => {
    try {
        const {updatedUser} = await UserService.updateCurrentUserService(req)
        attachCookiesToResponse({res, user: updatedUser});
        res.status(StatusCodes.OK).json({user: updatedUser})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const updateUserPassword = async (req, res) => {
    try {
        const {updatedUser} = await UserService.updateUserPasswordService(req);
        console.log(updatedUser)
        res.status(StatusCodes.OK).json({user: updatedUser, msg: 'Success! Password Updated.'})
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    getAllUsers,
    showCurrentUser,
    getSingleUser,
    updatedCurrentUser,
    updateUserPassword
}