const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity']
    }
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [CartItemSchema] // Sử dụng một mảng các đối tượng sản phẩm
});

module.exports = mongoose.model('Cart', CartSchema);
