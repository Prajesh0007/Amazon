const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookingType: {
    type: String,
    enum: ['Ride', 'Stay', 'HomeService'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Arriving', 'In-Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  dropLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  dates: {
    checkIn: Date,
    checkOut: Date
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
