const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();

// POST request for signup
router.post('/signup', signup);

// POST request for login
router.post('/login', login);

module.exports = router;
