const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  manufacturer: { type: String, default: 'Unknown' },
  variants: [{
    type: { type: String }, // size, color
    value: { type: String }
  }],
  seller: {
    name: { type: String, default: 'Amazon Clone' },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  aiSummary: {
    summary: String,
    pros: [String],
    cons: [String],
    verdict: String,
    sentimentScore: Number
  }
}, { timestamps: true });

productSchema.index({ name: 'text', category: 1, brand: 1 });

module.exports = mongoose.model('Product', productSchema);
