const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");

// 🔐 Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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

    // ✅ Redirect to frontend with token in URL
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

// ✅ GET /api/auth/user — Return logged in user's info
router.get('/user', authenticateToken, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
