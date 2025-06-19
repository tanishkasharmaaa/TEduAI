const router = require("express").Router();
const {verifyToken, restrictTo} = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken,restrictTo("teacher"),(req,res)=>{
    res.json({message:`Welcome Teacher ${req.user.userId}`});
});

module.exports = router;