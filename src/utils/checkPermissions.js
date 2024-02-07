const CustomError = require('../errors')

const checkPermissions = (reqUser, resourceUserId) => {
    if(reqUser.role === 'admin')
        return 
    if(reqUser.userId === resourceUserId.toString())
        return 
    throw new CustomError.UnauthenticatedError(
        'Bạn không có sở hữu tài khoản này'
    )
}

module.exports = checkPermissions;