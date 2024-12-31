const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const router = express.Router();

// Get all products
router.get('/', getProducts);

// Create a new product
router.post('/', createProduct);

module.exports = router;
