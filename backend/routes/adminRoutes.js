const router = require("express").Router();
const { verifyToken, restrictTo } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Course = require("../models/Course");
const { verify } = require("jsonwebtoken");
const { json } = require("express");

router.get("/dashboard",verifyToken,restrictTo("admin"),(req,res)=>{
    res.json({message:`Welcom Admin ${req.user.userId}`})
})

// Get all users
router.get("/users",verifyToken,restrictTo("admin"),async(req,res)=>{
    const users = await User.find().select("-passowrd");
    res.json(users)
})

// Promote user to teacher
router.post("/promote/:userId",verifyToken,restrictTo("admin"),async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.userId,{role:"teacher"},{new:true});
    res.json({message:`${user.name} promoted to teacher`,user});
})

// Delete a user
router.delete("/course/:courseId",verifyToken,restrictTo("admin"),async(req,res)=>{
    await User.findByIdAndDelete(req.params.userId);
    res.json({message:"User deleted successfully"});
})

// Delete a course
router.delete("/course/:courseId",verifyToken,restrictTo("admin"),async(req,res)=>{
    await Course.findByIdAndDelete(req.params.courseId);
    res.json({message:"Course deleted successfully"})
})

// Dashboard stats (optional)
router.get("/stats",verifyToken,restrictTo("admin"),async(req,res)=>{
    const studentCount = await User.countDocuments({role:"student"});
    const teacherCount = await User.countDocuments({role:"teacher"});
    const totalCourses = await Course.countDocuments();
    const totalRevenue = totalCourses*499;

    res.json({
    studentCount,
    teacherCount,
    totalCourses,
    estimatedRevenue:`₹${totalRevenue}`
})
})

module.exports = router