// orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getUserOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Create a new order
router.post("/", protect, createOrder);

// Get a specific order by ID
router.get("/:id", protect, getOrderById);

// Get all orders for a specific user
router.get("/user/:userId", protect, getUserOrders);

module.exports = router;
