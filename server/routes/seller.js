const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upgrade user to seller
// @route   PUT /api/seller/register
// @access  Private
router.put('/register', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.role === 'seller') {
      return res.status(400).json({ message: 'User is already a seller' });
    }
    user.role = 'seller';
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: req.headers.authorization.split(' ')[1], // pass the token back or regenerate
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Middleware to restrict to sellers
const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a seller' });
  }
};

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private/Seller
router.get('/products', protect, seller, async (req, res) => {
  const products = await Product.find({ 'seller.id': req.user._id });
  res.json(products);
});

// @desc    Create a product
// @route   POST /api/seller/products
// @access  Private/Seller
router.post('/products', protect, seller, async (req, res) => {
  const { name, price, description, images, category, subCategory, brand, stock, manufacturer } = req.body;

  const product = new Product({
    name: name || 'New Seller Item',
    price: price || 0,
    seller: {
      name: req.user.name,
      id: req.user._id
    },
    images: images && images.length > 0 ? images : ['https://via.placeholder.com/400'],
    brand: brand || 'Generic Brand',
    category: category || 'General',
    subCategory: subCategory || '',
    stock: stock || 0,
    numReviews: 0,
    description: description || 'New product description.',
    manufacturer: manufacturer || 'Generic Manufacturer'
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

module.exports = router;
