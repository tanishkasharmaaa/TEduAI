const router = require('express').Router();
const passport = require('passport');
const generateToken = require("../utils/generateToken");

// Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login", 
  }),
  (req, res) => {
    const token = generateToken(req.user); 
    res.status(200).json({ token });
    res.redirect(`http://localhost:5173`);
  }
);

module.exports = router;
