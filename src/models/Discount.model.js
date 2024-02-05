const mongoose = require('mongoose')

const DiscountSchema = new mongoose.Schema({
    discount_code: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 100,
    },
    discount_amount: {
        type: Number,
        required: [true, 'please provide amount']
    },
    discount_date: {
        type: Date,
        trim: true, 
        default: '',
        required: [true, 'please provide date']
    },
    discount_expires: {
        type: Date,
        trim: true, 
        default: '',
    }
})

module.exports = mongoose.model('Discount', DiscountSchema)