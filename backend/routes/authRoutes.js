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
    console.log(token)
    res.redirect(`https://t-edu-ai.vercel.app`);
  }
);

module.exports = router;
