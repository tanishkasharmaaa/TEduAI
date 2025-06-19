const router = require("express").Router();
const razorpay = require("../config/razorpay");
const {verifyToken, restrictTo} = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const User = require("../models/User");

// Create Dummy Order
router.post("/create-order/:courseId",verifyToken,restrictTo("student"),async(req,res)=>{
    const course = await Course.findById(req.params.courseId);
    if(!course) return res.status(404).json({message:"Course not found"});

    const options={
        amount:course.price*100,// in paise
        currency:"INR",
        receipt:`receipt_order_${Date.now()}`
    }

    try {
        const order = await razorpay.orders.create(options);
        res.json({orderId:order.id,amount:order.amount,currency:order.currency});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//  Verify Order & Enroll (fake success)
router.post("/verify-payment", verifyToken, restrictTo("student"), async (req, res) => {
  const { courseId, orderId } = req.body;

  //  Fake verify logic - real logic would check signature
  if (!orderId || !courseId) {
    return res.status(400).json({ message: "Invalid payment" });
  }

  const user = await User.findById(req.user.userId);
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const alreadyEnrolled = user.enrolledCourses.find(c => c.course.toString() === course._id.toString());
  if (alreadyEnrolled) return res.status(400).json({ message: "Already enrolled" });

  //  Enroll after fake payment
  user.enrolledCourses.push({ course: course._id, completedLectures: [] });
  await user.save();

  res.json({ message: "Payment successful. Enrolled in course." });
});

module.exports = router