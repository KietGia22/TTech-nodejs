const Product = require('../models/Product.model')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const GetAllProductsService = async (query) => {
    try {
        const queryObject = {};
        if (query.search) {
            queryObject.name = { $regex: query.search, $options: 'i' };
        } 
        if(query.cate) {
            queryObject.category = query.cate
        }
        if(query.sup){
            queryObject.company = query.sup
        }

        let result = Product.find(queryObject);

        if (query.sort === 'minTomax') {
            result = result.sort({ price: 1 });
        } else if (query.sort === 'a-z') {
            result = result.sort({ name: 1 });
        } else if (query.sort === 'z-a') {
            result = result.sort({ name: -1 });
        } else if (query.sort === 'maxTomin') {
            result = result.sort({price: -1})
        }

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 9;
        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);

        const products = await result;
        // console.log(products);

        const totalProducts = await Product.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalProducts / limit);

        return { products, numOfPages, totalProducts, currentPage: page };

    } catch (err) {
        console.log(err)
    }
}

const GetSingleProductService = async ({productId}) => {
    try {
        const product = await Product.findOne({_id: productId})

        if(!product)
            throw new CustomError.NotFoundError(`No product with id : ${productId}`)

        return {product: product}
    } catch(err) {
        throw err
    }
}

const updateProductService = async ({productId, body}) => {
    try {

        const product = await Product.findOneAndUpdate({
            _id: productId
        }, body, {
            new: true,
            runValidators: true
        });

        if(!product)
            throw new CustomError.NotFoundError(`No product with id : ${productId}`)

        return {product: product}
    } catch (err) {
        throw err
    }
}

const deleteProductService = async ({productId}) => {
    try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    await product.deleteOne();
    //or
    // const product = await Product.findByIdAndDelete({
    //     _id: productId
    // })
        
    return {msg: 'Delete successfully'}
    } catch (err) {
        throw err
    }
}

const uploadImageService = async ({productId, file}) => {
   try {
        console.log(file)
        const result = await cloudinary.uploader.upload(
            file, 
            {
                use_filename: true,
                folder: 'upload',
            }
        )
        fs.unlinkSync(file)

        const image = result.secure_url;

        const product = await Product.findOneAndUpdate(
            {_id: productId},
            {image: image},
            {
            new: true,
            runValidators: true
        })

        if(!product)
            throw new CustomError.NotFoundError(`No product with id : ${productId}`)

        return {src: image, msg: "Upload successfully"}
   } catch (err) {
    throw err
   }
}

module.exports = {
    GetAllProductsService,
    GetSingleProductService,
    updateProductService,
    deleteProductService,
    uploadImageService
}