const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../models/User");

/*
|--------------------------------------------------------------------------
| Register Page
|--------------------------------------------------------------------------
*/

router.get("/register", (req, res) => {
  res.render("register", {
    user: req.session.userName,
  });
});

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check empty fields
    if (!name || !email || !password || !confirmPassword) {
      return res.send("All fields are required");
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.send("Passwords do not match");
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send("Registration Error");
  }
});

/*
|--------------------------------------------------------------------------
| Login Page
|--------------------------------------------------------------------------
*/

router.get("/login", (req, res) => {
  res.render("login", {
    user: req.session.userName,
  });
});

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Invalid Email");
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.send("Invalid Password");
    }

    // Store session
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Login Error");
  }
});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.send("Logout Error");
    }

    res.redirect("/login");
  });
});

module.exports = router;