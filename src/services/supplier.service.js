const Supplier = require('../models/Supplier.model')
const CustomError = require('../errors')

const GetAllSuppliersService = async() => {
    try {
        const suppliers = await Supplier.find({})
        return {suppliers: suppliers}
    } catch (err) {
        throw err
    }
}

const GetSupplierIdService = async({supplier_name}) => {
    try {
        const supplier = await Supplier.findOne({
            name: supplier_name
        })
        console.log(supplier)
        const id = supplier._id
        return {supplierId: id}
    } catch (err) {
        throw err
    }
}

const ShowSupplierService = async({supplierId}) => {
    try {
        const supplier = await Supplier.findOne({
            _id: supplierId
        }).select('-_id')
        return {supplier: supplier}
    } catch (err) {
        throw err
    }
}

const ChangeSupplierService = async({supplierId, body, change}) => {
    try {
        if(change === 1){
            const check = await Supplier.findOne({_id: supplierId})

            if(!check)
                throw new CustomError.NotFoundError(`No category with id : ${supplierId}`)

            const supplier = await Supplier.findOneAndUpdate({
                _id: supplierId
            }, body, {
                new: true,
                runValidators: true
            })

            return {supplier: supplier}
        } 
        else if(change === 2){
            const supplier = await Supplier.findOne({_id: supplierId})

            if(!supplier)
                throw new CustomError.NotFoundError(`No category with id : ${supplierId}`)

            await supplier.deleteOne()
            return {msg: 'Delete successfully'}
        }
    } catch (err) {
        throw err
    }
}

const CreateSupplierService = async({body}) => {
    try {
        const supplier = await Supplier.create(body);
        return {supplier: supplier}
    } catch (err) {
        throw err
    }
}

module.exports = {
    GetAllSuppliersService,
    GetSupplierIdService,
    ShowSupplierService,
    ChangeSupplierService,
    CreateSupplierService
}