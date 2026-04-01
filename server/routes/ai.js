const express = require('express');
const router = express.Router();
const { askQwen, askQwenJSON } = require('../services/ollamaService');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    AI Shopping Assistant Chat (Streaming)
// @route   POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { messages, context } = req.body;
  const lastMessage = messages[messages.length - 1].content;

  const systemPrompt = `You are ShopBot, an AI assistant for Amazon Clone. 
  Help users find products, compare items, answer questions about orders, shipping, and returns. 
  
  CURRENT CONTEXT:
  - Page: ${context.page || 'Home'}
  - Cart: ${JSON.stringify(context.cart || [])}
  
  ACTIONABLE INTENTS:
  If the user wants to perform an action, prepend your response with exactly one of these blocks (and nothing else on that line):
  - [ACTION: SEARCH, QUERY: "search term"]
  - [ACTION: ADD_TO_CART, PRODUCT: "product name"]
  - [ACTION: VIEW_ORDERS]
  - [ACTION: VIEW_CART]
  
  Otherwise, just respond normally. Be concise and professional.`;

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await askQwen(lastMessage, systemPrompt, true);
    
    stream.on('data', (chunk) => {
      const payload = chunk.toString();
      try {
        const json = JSON.parse(payload);
        if (json.response) {
          res.write(`data: ${JSON.stringify({ response: json.response })}\n\n`);
        }
        if (json.done) {
          res.write('data: [DONE]\n\n');
          res.end();
        }
      } catch (e) {
        // Handle potential partial JSON chunks
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Chat Error' });
  }
});

// @desc    AI Semantic Search Parser
// @route   POST /api/ai/search
router.post('/search', async (req, res) => {
  const { query } = req.body;

  const prompt = `Extract search parameters from this query: "${query}". 
  Return JSON: { category: string, keywords: string[], minPrice: number, maxPrice: number, attributes: string[] }`;

  try {
    const params = await askQwenJSON(prompt, "You are a search query parser.");
    
    // Build MongoDB query
    const mongoQuery = {
      $or: [
        { name: { $regex: params.keywords.join('|') || query, $options: 'i' } },
        { category: { $regex: params.category || '', $options: 'i' } }
      ]
    };

    if (params.maxPrice) mongoQuery.price = { $lte: params.maxPrice };
    if (params.minPrice) mongoQuery.price = { ...mongoQuery.price, $gte: params.minPrice };

    const products = await Product.find(mongoQuery).limit(10);
    res.json({ products, params });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Search Error' });
  }
});

// @desc    AI Review Summarizer
// @route   POST /api/ai/summarize/:productId
router.post('/summarize/:productId', async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const reviews = await Review.find({ product: req.params.productId }).limit(20);

  if (!reviews || reviews.length === 0) {
    return res.status(400).json({ message: 'No reviews to summarize' });
  }

  const reviewText = reviews.map(r => `Rating: ${r.rating}, Comment: ${r.comment}`).join('\n');
  const prompt = `Summarize these customer reviews for ${product.name}. 
  Output JSON: { summary, pros[], cons[], verdict, sentimentScore (0-100) }`;

  try {
    const summary = await askQwenJSON(prompt, "You are a product review analyst.");
    product.aiSummary = summary;
    await product.save();
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Summary Error' });
  }
});

// @desc    AI Product Description Generator (Admin)
// @route   POST /api/ai/generate-desc
router.post('/generate-desc', async (req, res) => {
  const { name, specs } = req.body;

  const prompt = `Generate a high-converting, SEO-optimized product description for "${name}" with these specs: ${specs}.
  Return JSON: { description, keyFeatures: string[], keywords: string[] }`;

  try {
    const result = await askQwenJSON(prompt, "You are an expert copywriter.");
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Generation Error' });
  }
});

// @desc    AI Product Comparison (JSON)
// @route   POST /api/ai/compare
router.post('/compare', async (req, res) => {
  const { productA, productB } = req.body;

  const prompt = `Compare these two products in detail:
  Product A: ${productA.name} - ${productA.description} (Price: ₹${productA.price})
  Product B: ${productB.name} - ${productB.description} (Price: ₹${productB.price})
  
  Provide a comparison across 3-5 key features.
  Return ONLY JSON: 
  {
    "comparisons": [
      { "feature": "string", "productA": "string", "productB": "string", "winner": "A" | "B" | "Tie" }
    ],
    "verdict": "string (one sentence)",
    "targetUser": "string (one phrase)"
  }`;

  try {
    const comparison = await askQwenJSON(prompt, "You are a product comparison specialist.");
    res.json(comparison);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Comparison Error' });
  }
});

module.exports = router;
