const CategoryService = require('../services/category.service')
const {StatusCodes} = require('http-status-codes')

const GetAllCategories = async(req, res)=>{
    try {
        const {categories} = await CategoryService.GetAllCategoriesService()
        res.status(StatusCodes.OK).json({categories})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const GetCategoryId = async(req, res)=>{
    try {
        console.log(req.params)
        const {name: category_name} = req.params;
        const {categoryId} = await CategoryService.GetCategoryIdService({category_name})
        res.status(StatusCodes.OK).json({categoryId})
    }  catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }  
}

const ShowCategory = async(req, res)=>{
    try {
        const { id: categoryId } = req.params;
        const result = await CategoryService.ShowCategoryService({ categoryId });
        
        if (!result) {
            // Xử lý trường hợp không tìm thấy category
            res.status(StatusCodes.NOT_FOUND).json({ error: "Category not found" });
            return;
        }

        const { category } = result;
        res.status(StatusCodes.OK).json({ category });
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }

}

const UpdateCategory = async(req, res)=>{
    try {
        const {id: categoryId} = req.params;
        const body = req.body;
        const change = 1;

        const {category} = await CategoryService.ChangeCategoryService({categoryId, body, change})
        res.status(StatusCodes.OK).json({ category });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}

const DeleteCategory = async(req, res)=>{
    try {
        const {id: categoryId} = req.params;
        const change = 2;

        const {msg} = await CategoryService.ChangeCategoryService({categoryId, change})
        res.status(StatusCodes.OK).json({ msg });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}   

const CreateCategory = async(req, res)=>{
    try {
        const body = req.body
        const {category} = await CategoryService.CreateCategoryService({body});
        res.status(StatusCodes.CREATED).json({category})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    GetCategoryId,
    GetAllCategories,
    ShowCategory,
    UpdateCategory,
    DeleteCategory,
    CreateCategory
}