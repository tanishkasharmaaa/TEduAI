const router = require("express").Router();
const User = require("../models/User")

// routes/dev.js
router.post("/make-admin", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { role: "admin" },
    { new: true }
  );
  res.json({ message: `${user.name} is now admin`, user });
});

module.exports = router