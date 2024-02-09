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
        const { total, users } = await UserService.getAllUsersService()
        res.status(StatusCodes.OK).json({total, users})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const getSingleUser = async (req, res) => {
    try {
        const {id: userId} = req.params
        const user = req.user;
        const {SingleUser} = await UserService.getSingleUserService({userId, user});
        console.log(SingleUser);
        res.status(StatusCodes.OK).json({user})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const updatedCurrentUser = async (req,res) => {
    try {
        const body = req.body
        const user = req.user
        const {updatedUser} = await UserService.updateCurrentUserService({body, user})
        attachCookiesToResponse({res, user: updatedUser});
        res.status(StatusCodes.OK).json({user: updatedUser})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const updateUserPassword = async (req, res) => {
    try {
        const {userId} = req.user
        const body = req.body
        const {updatedUser} = await UserService.updateUserPasswordService({body, userId});
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