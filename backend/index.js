const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

require('./config/passport'); 

dotenv.config();

const app = express();


app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use(passport.initialize());

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use("/api/dev", require("./routes/dev"));
app.use('/api/doubt', require('./routes/doubt'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`)))
  .catch(err => console.log(err));
