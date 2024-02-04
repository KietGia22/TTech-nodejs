const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true,
        required: [true, 'Please provide product name'],
        maxlength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg'
    },
    quantity_pr: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

ProductSchema.pre("deleteOne", { document: true }, async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});


module.exports = mongoose.model('Product', ProductSchema);