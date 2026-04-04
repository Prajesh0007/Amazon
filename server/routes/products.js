const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  const { keyword, category, brand, minPrice, maxPrice, sort, serviceType } = req.query;

  const query = {};

  if (serviceType && serviceType !== 'All') {
    query.serviceType = serviceType;
  }

  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }
  
  if (category && category !== 'All') {
    query.category = { $regex: `^${category}$`, $options: 'i' };
  }
  
  if (brand) {
    query.brand = brand;
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting logic
  let sortOrder = { createdAt: -1 }; 
  if (sort === 'price-low') sortOrder = { price: 1 };
  if (sort === 'price-high') sortOrder = { price: -1 };
  if (sort === 'rating') sortOrder = { rating: -1 };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOrder)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Create a product (Admin)
// @route   POST /api/products
router.post('/', protect, admin, async (req, res) => {
  const { name, price, description, images, category, subCategory, brand, stock } = req.body;

  const product = new Product({
    name: name || 'Sample Name',
    price: price || 0,
    seller: {
      name: req.user.name,
      id: req.user._id
    },
    images: images || ['/images/sample.jpg'],
    brand: brand || 'Sample Brand',
    category: category || 'Sample Category',
    subCategory: subCategory || 'Sample SubCategory',
    stock: stock || 0,
    numReviews: 0,
    description: description || 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
  const { name, price, description, images, category, subCategory, brand, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const Review = require('../models/Review');
const Question = require('../models/Question');

// ... existing routes ...

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const review = new Review({
      product: req.params.id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    await review.save();
    
    // Update product rating
    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Get questions for a product
// @route   GET /api/products/:id/questions
router.get('/:id/questions', async (req, res) => {
  const questions = await Question.find({ product: req.params.id }).sort({ createdAt: -1 });
  res.json(questions);
});

// @desc    Create a question
// @route   POST /api/products/:id/questions
router.post('/:id/questions', protect, async (req, res) => {
  const { question } = req.body;
  const q = new Question({
    product: req.params.id,
    user: req.user._id,
    question
  });

  await q.save();
  res.status(201).json(q);
});

module.exports = router;
