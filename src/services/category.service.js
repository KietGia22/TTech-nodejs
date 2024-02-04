const Category = require('../models/Category.model')
const CustomError = require('../errors')

const GetAllCategoriesService = async() => {
    try {
        const categories = await Category.find({})
        return {categories: categories}
    } catch (err) {
        throw err
    }
}

const GetCategoryIdService = async({category_name}) => {
    try {
        const category = await Category.findOne({
            name: category_name
        })
        console.log(category)
        const id = category._id
        return {categoryId: id}
    } catch (err) {
        throw err
    }
}

const ShowCategoryService = async({categoryId}) => {
    try {
        const category = await Category.findOne({
            _id: categoryId
        }).select('-_id')
        return {category: category}
    } catch (err) {
        throw err
    }
}

const ChangeCategoryService = async({categoryId, body, change}) => {
    try {
        if(change === 1){
            const check = await Category.findOne({_id: categoryId})

            if(!check)
                throw new CustomError.NotFoundError(`No category with id : ${categoryId}`)

            const category = await Category.findOneAndUpdate({
                _id: categoryId
            }, body, {
                new: true,
                runValidators: true
            })

            return {category: category}
        } 
        else if(change === 2){
            const category = await Category.findOne({_id: categoryId})

            if(!category)
                throw new CustomError.NotFoundError(`No category with id : ${categoryId}`)

            await category.deleteOne()
            return {msg: 'Delete successfully'}
        }
    } catch (err) {
        throw err
    }
}

const CreateCategoryService = async({body}) => {
    try {
        const category = await Category.create(body);
        return {category: category}
    } catch (err) {
        throw err
    }
}

module.exports = {
    GetAllCategoriesService,
    GetCategoryIdService,
    ShowCategoryService,
    ChangeCategoryService,
    CreateCategoryService
}