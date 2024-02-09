const mongoose = require('mongoose');

// Hàm để thêm 7 giờ vào thời gian hiện tại
const add7Hours = () => {
    const now = new Date();
    return new Date(now.getTime() + 7 * 60 * 60 * 1000); // Thêm 7 giờ
};

const SingleOrderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
});

const OrderSchema = new mongoose.Schema({
    shippingFee: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    },
    create_order_at: {
        type: Date,
        default: add7Hours // Sử dụng hàm add7Hours để thêm 7 giờ vào thời gian hiện tại
    }
});

module.exports = mongoose.model('Order', OrderSchema);
