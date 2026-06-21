module.exports = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  next();
};