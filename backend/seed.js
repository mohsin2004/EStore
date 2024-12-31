// seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  const adminExists = await User.findOne({ email: "admin@admin.com" });
  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const adminUser = new User({
    name: "Admin",
    email: "admin@admin.com",
    password: "admin",
    isAdmin: true,
  });

  await adminUser.save();
  console.log("Admin user created");
  mongoose.connection.close();
};

seedAdmin();
