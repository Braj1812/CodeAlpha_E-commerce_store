const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./models/Product");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "Dell Inspiron Laptop",
        description: "Intel Core i7, 16GB RAM, 512GB SSD",
        price: 65000,
        image: "https://picsum.photos/500?1",
        category: "Electronics",
        stock: 10,
      },
      {
        name: "iPhone 15",
        description: "Apple iPhone 15 128GB Blue",
        price: 79999,
        image: "https://picsum.photos/500?2",
        category: "Mobile",
        stock: 8,
      },
      {
        name: "Sony Headphones",
        description: "Wireless Noise Cancelling Headphones",
        price: 9999,
        image: "https://picsum.photos/500?3",
        category: "Accessories",
        stock: 20,
      },
    ]);

    console.log("✅ Products Added Successfully");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });