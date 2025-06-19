const router = require("express").Router();
const {verifyToken, restrictTo} = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const upload = require("../utils/upload");


// Add Course (basic info)
router.post('/',verifyToken,restrictTo('teacher'),async(req,res)=>{
  try {
    const course = await Course.create({
        ...req.body,
        createdBy: req.user.userId
    });
    res.status(201).json(course)
  } catch (error) {
    res.status(500).json({error:err.message});
  }
})

// Get All Courses (public)
router.get('/',async(req,res)=>{
    try {
        const courses = await Course.find().select('title category price');
        res.json(courses)
    } catch (error) {
        res.status(500).json({error:err.message})
    }
})

// Get Sing Course by ID
router.get('/:id',async(req,res)=>{
    try {
        const course = await Course.findById(req.params.id).populate('createdBy','name');
        if(!course) return res.status(404).json({message:"Course not found"});
        res.json(course);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

module.exports = router