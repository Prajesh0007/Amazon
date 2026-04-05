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
  },
  specifications: {
    type: Map,
    of: String
  },
  isPrime: { type: Boolean, default: true },
  serviceType: { 
    type: String, 
    enum: ['Shopping', 'Food', 'Grocery', 'Pharmacy', 'Stay', 'Ride', 'HomeService'], 
    default: 'Shopping' 
  },
  isVeg: { type: Boolean },
  ingredients: [{ type: String }],
  recipe: { type: String },
  cookingTime: { type: Number },
  amenities: [{ type: String }],
  views: [{ type: String }],
  maxGuests: { type: Number },
  hasAC: { type: Boolean },
  isBestSeller: { type: Boolean, default: false },
  timeToDeliver: { type: String, default: '2-4 Days' },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  }
}, { timestamps: true });

productSchema.index({ name: 'text', category: 1, brand: 1 });

module.exports = mongoose.model('Product', productSchema);
