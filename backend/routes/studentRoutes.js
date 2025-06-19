const router = require("express").Router();
const {verifyToken, restrictTo} = require("../middleware/authMiddleware");
const User = require("../models/User");
const Course = require("../models/Course");

router.get("/dashboard", verifyToken, restrictTo("student"),(req,res)=>{
    res.json({message:`Welcome Student ${req.user.userId}`})
});

// Enroll in a Course
router.post('/enroll/:courseId',verifyToken,restrictTo('student'),async(req,res)=>{
    const user = await User.findById(req.user.userId);
    const course = await Course.findById(req.params.courseId);
    if(!course) return res.status(404).json({message:"Course not found"});

    const alreadyEnrolled = user.enrolledCourses.find(c=>c.course.toString()=== course._id.toString());
    if(alreadyEnrolled) return res.status(400).json({message:'Already enrolled'});

    user.enrolledCourses.push({course:course._id,completedLectures:[]});
    await user.save();
    res.json({message: 'Enrollment sucessful'});
})

// Mark Lecture Complete
router.post('/mark-complete/:courseId/:lectureId',verifyToken,restrictTo('student'),async(req,res)=>{
    const user = await User.findById(req.user.userId);
    const courseProgress = user.enrolledCourses.find(
        c=>c.course.toString()===req.params.courseId
    );

    if(!courseProgress) return res.status(404).json({message:"Not enrolled in this course"});

    if(!courseProgress.completedLectures.includes(req.params.lectureId)){
        courseProgress.completedLectures.push(req.params.lectureId);
    }

    await user.save()
    res.json({message:"Lecture marked complete"})
})

router.get('/progress/:courseId', verifyToken, restrictTo('student'), async (req, res) => {
  const user = await User.findById(req.user.userId);
  const course = await Course.findById(req.params.courseId);
  const courseProgress = user.enrolledCourses.find(
    c => c.course.toString() === course._id.toString()
  );

  const totalLectures = course.lectures.length;
  const completed = courseProgress?.completedLectures?.length || 0;
  const progress = totalLectures > 0 ? (completed / totalLectures) * 100 : 0;

  res.json({ progress: `${progress.toFixed(1)}%` });
});


module.exports = router;