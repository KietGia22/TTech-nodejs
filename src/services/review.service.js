const Review = require('../models/Review.model')
const CustomError = require('../errors')
const Product = require('../models/Product.model')
const { checkPermissions } = require('../utils')

const createReviewService = async({body, user}) =>{
    const {product: productId} = body 
    const isValidProduct = await Product.findOne({_id: productId})
    if(!isValidProduct)
        throw new CustomError.NotFoundError(`No product with id : ${productId}`)

    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: user
    })
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError(
        'Already submitted review for this product'
        )
    }

    body.user = user;
    const review = await Review.create(body);
    return {review: review}
  }

const getAllReviewsService = async() => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name company price'
    })
    return {reviews: reviews}
}

const getSingleReviewService = async({reviewId}) => {
    const review = await Review.findOne({
        _id: reviewId,
    });

    if(!review) 
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)

    return {review: review}
}

const updateReviewService = async({reviewId, body, user}) => {
    const review = await Review.findOne({
        _id: reviewId,
    });
    if(!review)
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)

    checkPermissions(user, review.user)

    review.rating = body.rating;
    review.title = body.title;
    review.comment = body.comment;
    await review.save();

    const msg = 'Update successfully';

    return {review: review, msg: msg}
}

const deleteReviewService = async({reviewId, user}) => {
    const review = await Review.findOne({
        _id: reviewId,
    });
    if(!review)
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)

    checkPermissions(user, review.user)
    
    await review.deleteOne();

    return {msg: 'Delete successfully'}
}

const getSingleProductReviewService = async({productId}) => {
    const reviews = await Review.find({product: productId})
    return {reviews: reviews}
}

module.exports = {
    createReviewService,
    getAllReviewsService,
    getSingleReviewService,
    getSingleProductReviewService,
    updateReviewService,
    deleteReviewService
}
