const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user cart
// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
});

// @desc    Update user cart
// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
  const { items } = req.body;
  
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = items;
    await cart.save();
  } else {
    cart = await Cart.create({
      user: req.user._id,
      items
    });
  }

  res.json(cart);
});

module.exports = router;
