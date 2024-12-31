const Product = require('../models/productModel');

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: req.file ? req.file.path : null,  // Assuming you're handling file uploads
    });

    const createdProduct = await product.save();
    console.log('Created Product:', createdProduct);  // Log to confirm product is saved
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: "Failed to create product", error });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products from the database
    res.status(200).json(products);  // Send the products as JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

module.exports = { createProduct, getProducts };
