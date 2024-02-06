const {StatusCodes} = require('http-status-codes')
const ProductService = require('../services/product.service');
const ProductModels = require('../models/Product.model');



const createProduct = async (req, res) => {
    // res.send(`createProduct`)
    req.body.user = req.user.userId;
    const product = await ProductModels.create(req.body);
    res.status(StatusCodes.CREATED).json({product})
}

const GetAllProducts = async (req, res) => {
    // res.send(`getAllProducts`)
    try {
        const query = req.query;      
        const {products, numOfPages, totalProducts, currentPage } = await ProductService.GetAllProductsService(query);
        res.status(StatusCodes.OK).json({products, numOfPages, totalProducts, currentPage});
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const GetSingleProduct = async (req, res) => {
    // res.send(`getSingleProduct`)
    try {
        const {id: productId} = req.params
        const {product} = await ProductService.GetSingleProductService({productId});
        res.status(StatusCodes.OK).json({product})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    } 
}

const updateProduct = async (req, res) => {
    // res.send(`updateProduct`)
    try {
        const {id: productId} = req.params;
        const body = req.body
        const {product} = await ProductService.updateProductService({productId, body});
        res.status(StatusCodes.OK).json({product})

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const deleteProduct = async (req, res) => {
    // res.send(`deleteProduct`)
    try {
        const {id: productId} = req.params
        const {msg} = await ProductService.deleteProductService({productId});
        res.status(StatusCodes.OK).json({msg})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const uploadImage = async (req, res) => {
    // res.send(`uploadImage`)
    try {
        const {id: productId} = req.params
        const file = req.files.image.tempFilePath
        console.log(file)
        const {src, msg} = await ProductService.uploadImageService({productId, file});
        res.status(StatusCodes.OK).json({image: src, msg})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    createProduct, 
    GetAllProducts,
    GetSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}