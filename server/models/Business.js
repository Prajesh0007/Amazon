const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  businessType: { 
    type: String, 
    enum: ['Restaurant', 'GroceryStore', 'Pharmacy', 'Warehouse'],
    required: true 
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isOpen: { type: Boolean, default: true },
  avgDeliveryTime: { type: String, default: '30 mins' },
  avgCostForTwo: { type: Number },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
