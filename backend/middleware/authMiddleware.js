const jwt = require("jsonwebtoken");
require("dotenv").config()

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"Unauthorized"});

    try {
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded; //
        next()
    } catch (error) {
        return res.status(403).json({message: "Token invalid"});
    }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};


module.exports = { verifyToken, restrictTo };
