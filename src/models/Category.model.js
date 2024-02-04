const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 100,
    },
})

CategorySchema.pre("deleteOne", {document: true}, async function(next){
    await this.model("Product").deleteMany({ category: this._id });
    next();
})

module.exports = mongoose.model("Category", CategorySchema);
