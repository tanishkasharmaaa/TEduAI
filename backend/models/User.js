const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
   role: {
  type: String,
  enum: ['student', 'teacher', 'admin'],
  default: 'student'
}
,
    googleId:String,
    enrolledCourses:[{
        course:{type:mongoose.Schema.Types.ObjectId,ref:'Course'},
        completedLectures: [String]
    }]
})

module.exports = mongoose.model('User',userSchema);