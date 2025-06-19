const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    title: String,
    videoUrl:String
});

const courseSchema = new mongoose.Schema({
    title:String,
    description:String,
    category:String,
    price:Number,
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    lectures:[lectureSchema],
    createdAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model("Course",courseSchema);