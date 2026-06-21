const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

/*
|--------------------------------------------------------------------------
| Checkout
|--------------------------------------------------------------------------
*/

router.post("/checkout", auth, async (req, res) => {
  try {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.redirect("/cart");
    }

    let items = [];
    let totalAmount = 0;

    for (const item of cart) {
      const product = await Product.findById(item.productId);

      if (product) {
        totalAmount += product.price * item.quantity;

        items.push({
          product: product._id,
          quantity: item.quantity,
        });
      }
    }

    await Order.create({
      user: req.session.userId,
      items,
      totalAmount,
    });

    // Clear cart after checkout
    req.session.cart = [];

    // Show success page
    res.render("orderSuccess", {
      user: req.session.userName,
    });

  } catch (error) {
    console.log(error);
    res.send("Checkout Error");
  }
});

/*
|--------------------------------------------------------------------------
| My Orders
|--------------------------------------------------------------------------
*/

router.get("/orders", auth, async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.session.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.render("orders", {
      orders,
      user: req.session.userName,
    });

  } catch (error) {
    console.log(error);
    res.send("Orders Error");
  }
});

/*
|--------------------------------------------------------------------------
| Delete Order
|--------------------------------------------------------------------------
*/

router.post("/orders/delete/:id", auth, async (req, res) => {
  try {

    await Order.findByIdAndDelete(req.params.id);

    res.redirect("/orders");

  } catch (error) {
    console.log(error);
    res.send("Delete Error");
  }
});

module.exports = router;