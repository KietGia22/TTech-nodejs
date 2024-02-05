const DiscountService = require('../services/discount.service')
const {StatusCodes} = require('http-status-codes')

const GetAllDiscounts = async(req, res)=>{
    try {
        const {discounts} = await DiscountService.GetAllDiscountsService()
        res.status(StatusCodes.OK).json({discounts})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const GetDiscountId = async(req, res)=>{
    try {
        console.log(req.params)
        const {name: discount_name} = req.params;
        const {dicountId} = await DiscountService.GetDiscountIdService({discount_name})
        res.status(StatusCodes.OK).json({dicountId})
    }  catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }  
}

const ShowDiscount = async(req, res)=>{
    try {
        const { id: discountId } = req.params;
        const result = await DiscountService.ShowDiscountService({ discountId });
        
        if (!result) {
            // Xử lý trường hợp không tìm thấy Discount
            res.status(StatusCodes.NOT_FOUND).json({ error: "Discount not found" });
            return;
        }

        const { discount } = result;
        res.status(StatusCodes.OK).json({ discount });
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }

}

const UpdateDiscount = async(req, res)=>{
    try {
        const {id: discountId} = req.params;
        const body = req.body;
        const change = 1;

        const {discount} = await DiscountService.ChangeDiscountService({discountId, body, change})
        res.status(StatusCodes.OK).json({ discount });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}

const DeleteDiscount = async(req, res)=>{
    try {
        const {id: discountId} = req.params;
        const change = 2;

        const {msg} = await DiscountService.ChangeDiscountService({discountId, change})
        res.status(StatusCodes.OK).json({ msg });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}   

const CreateDiscount = async(req, res)=>{
    try {
        const body = req.body
        const {discount} = await DiscountService.CreateDiscountService({body});
        res.status(StatusCodes.CREATED).json({discount})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    GetDiscountId,
    GetAllDiscounts,
    ShowDiscount,
    UpdateDiscount,
    DeleteDiscount,
    CreateDiscount
}