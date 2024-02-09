const User = require('../models/Auth.model')
const CustomError = require('../errors')
const {
    createTokenUser,
    checkPermissions
} = require('../utils');

const getAllUsersService = async() => {
    const users = await User.find({ role: 'user' }).select('-password');
    const total = users.length
    // console.log(users);
    return {users: users, total: total}
}

const getSingleUserService = async({userId, user}) => {
    const SingleUser = await User.findOne({_id: userId}).select('-password')
    
    if(!user)
        throw new CustomError.NotFoundError(`No user with id : ${userId}`);
    
    checkPermissions(user, SingleUser._id);
    
    return {SingleUser: user}
}

const updateCurrentUserService = async({body, user}) => {
    const {email, name} = body;

    if(!email || !name)
        throw new CustomError.BadRequestError('Please provide all values');

    const userTemp = await User.findOneAndUpdate(
        {_id: user.userId},
        {email, name},
        {new: true, runValidators: true}
    )

    const updatedUser = createTokenUser(userTemp);
    return {updatedUser: updatedUser}
}

const updateUserPasswordService = async({body, userId}) => {
    const {oldPassword, newPassword} = body;
    if(!oldPassword || !newPassword)
        throw new CustomError.BadRequestError('Please provide all values');

    const user = await User.findOne({_id: userId});

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