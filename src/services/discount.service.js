const Discount = require('../models/Discount.model')
const CustomError = require('../errors')

const GetAllDiscountsService = async() => {
    try {
        const discounts = await Discount.find({})
        return {discounts: discounts}
    } catch (err) {
        throw err
    }
}

const GetDiscountIdService = async({discount_name}) => {
    try {
        const discount = await Discount.findOne({
            name: discount_name
        })
        console.log(discount)
        const id = discount._id
        return {discountId: id}
    } catch (err) {
        throw err
    }
}

const ShowDiscountService = async({discountId}) => {
    try {
        const discount = await Discount.findOne({
            _id: discountId
        }).select('-_id')
        return {discount: discount}
    } catch (err) {
        throw err
    }
}

const ChangeDiscountService = async({discountId, body, change}) => {
    try {
        if(change === 1){
            const check = await Discount.findOne({_id: discountId})

            if(!check)
                throw new CustomError.NotFoundError(`No category with id : ${discountId}`)

            const discount = await Discount.findOneAndUpdate({
                _id: discountId
            }, body, {
                new: true,
                runValidators: true
            })

            return {discount: discount}
        } 
        else if(change === 2){
            const discount = await Discount.findOne({_id: discountId})

            if(!Discount)
                throw new CustomError.NotFoundError(`No category with id : ${discountId}`)

            await Discount.deleteOne()
            return {msg: 'Delete successfully'}
        }
    } catch (err) {
        throw err
    }
}

const CreateDiscountService = async({body}) => {
    try {
        const discount = await Discount.create(body);
        return {discount: discount}
    } catch (err) {
        throw err
    }
}

module.exports = {
    GetAllDiscountsService,
    GetDiscountIdService,
    ShowDiscountService,
    ChangeDiscountService,
    CreateDiscountService
}