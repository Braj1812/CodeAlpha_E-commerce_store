const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

router.post("/cart/add/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingItem = req.session.cart.find(
      item => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({
        productId,
        quantity: 1,
      });
    }

    res.redirect("/cart");

  } catch (error) {
    console.log(error);
    res.send("Cart Error");
  }
});

/*
|--------------------------------------------------------------------------
| View Cart
|--------------------------------------------------------------------------
*/

router.get("/cart", async (req, res) => {
  try {

    const cart = req.session.cart || [];

    let cartItems = [];
    let total = 0;

    for (const item of cart) {

      const product = await Product.findById(
        item.productId
      );

      if (product) {

        const subtotal =
          product.price * item.quantity;

        total += subtotal;

        cartItems.push({
          product,
          quantity: item.quantity,
          subtotal,
        });
      }
    }

    res.render("cart", {
      cartItems,
      total,
      user: req.session.userName,
    });

  } catch (error) {
    console.log(error);
    res.send("Cart Error");
  }
});

/*
|--------------------------------------------------------------------------
| Remove Item
|--------------------------------------------------------------------------
*/

router.post("/cart/remove/:id", (req, res) => {

  if (!req.session.cart) {
    return res.redirect("/cart");
  }

  req.session.cart =
    req.session.cart.filter(
      item => item.productId !== req.params.id
    );

  res.redirect("/cart");
});

module.exports = router;