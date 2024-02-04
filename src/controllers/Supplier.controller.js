const SupplierService = require('../services/supplier.service')
const {StatusCodes} = require('http-status-codes')

const GetAllSuppliers = async(req, res)=>{
    try {
        const {suppliers} = await SupplierService.GetAllSuppliersService()
        res.status(StatusCodes.OK).json({suppliers})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

const GetSupplierId = async(req, res)=>{
    try {
        console.log(req.params)
        const {name: supplier_name} = req.params;
        const {supplierId} = await SupplierService.GetSupplierIdService({supplier_name})
        res.status(StatusCodes.OK).json({supplierId})
    }  catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }  
}

const ShowSupplier = async(req, res)=>{
    try {
        const { id: supplierId } = req.params;
        const result = await SupplierService.ShowSupplierService({ supplierId });
        
        if (!result) {
            // Xử lý trường hợp không tìm thấy Supplier
            res.status(StatusCodes.NOT_FOUND).json({ error: "Supplier not found" });
            return;
        }

        const { supplier } = result;
        res.status(StatusCodes.OK).json({ supplier });
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }

}

const UpdateSupplier = async(req, res)=>{
    try {
        const {id: supplierId} = req.params;
        const body = req.body;
        const change = 1;

        const {supplier} = await SupplierService.ChangeSupplierService({supplierId, body, change})
        res.status(StatusCodes.OK).json({ supplier });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}

const DeleteSupplier = async(req, res)=>{
    try {
        const {id: supplierId} = req.params;
        const change = 2;

        const {msg} = await SupplierService.ChangeSupplierService({supplierId, change})
        res.status(StatusCodes.OK).json({ msg });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}   

const CreateSupplier = async(req, res)=>{
    try {
        const body = req.body
        const {supplier} = await SupplierService.CreateSupplierService({body});
        res.status(StatusCodes.CREATED).json({supplier})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

module.exports = {
    GetSupplierId,
    GetAllSuppliers,
    ShowSupplier,
    UpdateSupplier,
    DeleteSupplier,
    CreateSupplier
}