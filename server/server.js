require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const aiRoutes = require('./routes/ai');
const sellerRoutes = require('./routes/seller');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// DB Connection Middleware for Serverless Environment
app.use(async (req, res, next) => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb';
  
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  if (mongoose.connection.readyState === 2) {
    return next();
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Add a timeout to prevent hanging
    });
    console.log('MongoDB Connected successfully');
    next();
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    res.status(500).json({ message: 'Database connection failed. Please check IP Whitelist and Credentials.', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/seller', sellerRoutes);

// Root helper message
app.get('/', (req, res) => {
  res.send('Amazon Clone Backend is running. Please visit http://localhost:5173 for the frontend website!');
});

// Static for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handler
app.use(errorHandler);

// Export the Express app for Vercel Serverless Functions
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  // Let the middleware handle DB connection on the first request, 
  // or connect here to be ready before listen
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb';
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Local MongoDB Pre-Connected');
      app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
    })
    .catch(err => {
      console.error('Local Database connection error:', err.message);
    });
}