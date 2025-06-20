const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");
const User = require('../models/User'); // Make sure the path is correct

// 🔐 Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This should contain { id, email, name } ideally
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// 🌐 Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔁 Google OAuth callback
router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = generateToken(req.user); 
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

// ✅ Get user details using token
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Omit password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

