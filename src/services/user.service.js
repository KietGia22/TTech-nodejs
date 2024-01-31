const User = require('../models/Auth.model')
const CustomError = require('../errors')
const {
    createTokenUser,
    checkPermissions
} = require('../utils');

const getAllUsersService = async(data) => {
    console.log(data);
    const users = await User.find({ role: 'user' }).select('-password');
    // console.log(users);
    return {users: users}
}

const getSingleUserService = async(req) => {
    // console.log(req)
    const user = await User.findOne({_id: req.params.id}).select('-password')
    
    if(!user)
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    
    checkPermissions(req.user, user._id);
    
    return {user: user}
}

const updateCurrentUserService = async(req, res) => {
    const {email, name} = req.body;

    if(!email || !name)
        throw new CustomError.BadRequestError('Please provide all values');

    const user = await User.findOneAndUpdate(
        {_id: req.user.userId},
        {email, name},
        {new: true, runValidators: true}
    )

    const updatedUser = createTokenUser(user);
    return {updatedUser: updatedUser}
}

const updateUserPasswordService = async(req) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword)
        throw new CustomError.BadRequestError('Please provide all values');

    const user = await User.findOne({_id: req.user.userId});

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect)
        throw new CustomError.UnauthenticatedError('Sai mat khau roi thang lon');

    user.password = newPassword;
    await user.save();

    return {updatedUser: user}
}

module.exports = {
    getAllUsersService,
    getSingleUserService,
    updateCurrentUserService,
    updateUserPasswordService
}