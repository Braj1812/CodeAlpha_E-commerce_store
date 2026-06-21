const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.render("home", {
      products,
      user: req.session.userName,
    });
  } catch (error) {
    console.log(error);
    res.send("Server Error");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.render("product", {
      product,
      user: req.session.userName,
    });
  } catch (error) {
    console.log(error);
    res.send("Product Not Found");
  }
});

module.exports = router;