const mongoose = require("mongoose");
const dotenv = require("dotenv");
const faker = require("faker");
const Product = require("./models/productModel");
const User = require("./models/userModel");

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Generate Mock Data
const createMockData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create mock products
    const products = Array.from({ length: 25 }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      image: faker.image.imageUrl(),
      category: faker.commerce.department(),
      stock: faker.random.number({ min: 1, max: 100 }),
    }));

    // Create mock users
    const users = Array.from({ length: 10 }, () => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isAdmin: faker.random.boolean(),
    }));

    // Save mock data to the database
    await Product.insertMany(products);
    await User.insertMany(users);

    console.log("Mock data inserted successfully!");
    process.exit(0); // Exit the script
  } catch (error) {
    console.error("Error inserting mock data:", error);
    process.exit(1);
  }
};

createMockData();
