const mongoose = require("mongoose");
const dotenv = require("dotenv");
const faker = require("faker"); // Library to generate fake data
const Product = require("./models/productModel");
const User = require("./models/userModel");
const Order = require("./models/orderModel");

dotenv.config(); // Load environment variables

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Seed function to generate mock data
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    // Seed Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: "123456", // Set a default password for all users
        isAdmin: i === 0, // Make the first user an admin
      });
      users.push(user);
    }
    await User.insertMany(users);
    console.log("Users seeded successfully");

    // Seed Products
    const products = [];
    for (let i = 0; i < 20; i++) {
      const product = new Product({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.imageUrl(),
        category: faker.commerce.department(),
        stock: faker.random.number({ min: 1, max: 100 }),
      });
      products.push(product);
    }
    await Product.insertMany(products);
    console.log("Products seeded successfully");

    // Seed Orders (optional, for mock order data)
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const order = new Order({
        user: users[faker.random.number({ min: 0, max: users.length - 1 })]._id,
        orderItems: [
          {
            product: products[faker.random.number({ min: 0, max: products.length - 1 })]._id,
            quantity: faker.random.number({ min: 1, max: 5 }),
          },
        ],
        shippingAddress: {
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          postalCode: faker.address.zipCode(),
          country: faker.address.country(),
        },
        paymentMethod: "Credit Card",
        paymentResult: {
          id: faker.random.uuid(),
          status: "success",
          update_time: new Date().toISOString(),
          email_address: faker.internet.email(),
        },
        totalPrice: parseFloat(faker.commerce.price()),
        isPaid: faker.random.boolean(),
        paidAt: faker.random.boolean() ? new Date() : null,
        isDelivered: faker.random.boolean(),
        deliveredAt: faker.random.boolean() ? new Date() : null,
      });
      orders.push(order);
    }
    await Order.insertMany(orders);
    console.log("Orders seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

// Run the seed function
seedData();
