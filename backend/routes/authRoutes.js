const router = require('express').Router();
const passport = require('passport');
const generateToken = require("../utils/generateToken")

// Google Login 
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

// Google callback
router.get("/google/callback", passport.authenticate("google", {
  session: false,
  failureRedirect: "/login",
}), (req, res) => {
  const token = generateToken(req.user);
  // Send JWT token in a redirect or cookie or response
  res.redirect(`https://t-edu-ai.vercel.app?token=${token}`);
});


module.exports = router