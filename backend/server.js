const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path'); // Required to handle paths

dotenv.config();  // Load environment variables from .env

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


  app.use('/api', userRoutes);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));  // Serve frontend files

// Define API routes
app.use('/api/products', productRoutes);

// Catch all route to serve index.html for non-API requests (like root `/`)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));  // Serve index.html
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
