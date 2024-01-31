const ReviewService = require('../services/review.service')
const {StatusCodes} = require('http-status-codes')

const createReview = async(req, res) => {
    try {
        const body = req.body;
        const user = req.user.userId;
        const {review} = await ReviewService.createReviewService({body, user})
        res.status(StatusCodes.OK).json({review})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const getAllReviews = async(req, res) => {
    try {
        const {reviews} = await ReviewService.getAllReviewsService();
        res.status(StatusCodes.OK).json({reviews, count: reviews.length})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const getSingleReview = async(req, res) => {
    try {
        const {id: reviewId} = req.params;
        const {review} = await ReviewService.getSingleReviewService({reviewId});
        res.status(StatusCodes.OK).json({review})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const getSingleProductReview = async(req, res) => {
    try {
        const {id: productId} = req.params;
        const {reviews} = await ReviewService.getSingleProductReviewService({productId})
        res.status(StatusCodes.OK).json({reviews})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const updateReview = async(req, res) => {
    try {
        const {id: reviewId} = req.params;
        const body = req.body;
        const user = req.user;
        const {review, msg} = await ReviewService.updateReviewService({reviewId, body, user});
        res.status(StatusCodes.OK).json({review, msg})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const deleteReview = async(req, res) => {
    try {
        const {id: reviewId} = req.params;
        const user = req.user;
        const {msg} = await ReviewService.deleteReviewService({reviewId, user});
        res.status(StatusCodes.OK).json({msg})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    getSingleProductReview,
    updateReview,
    deleteReview
}