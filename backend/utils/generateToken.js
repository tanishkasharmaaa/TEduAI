const jwt = require('jsonwebtoken');
require("dotenv").config()

const generateToken = (user) =>{
    return jwt.sign(
        {
            userId: user._id, role:user.role
        },
        process.env.JWT_SECRET,
        {expiresIn:'1hr'}
    )
}

module.exports = generateToken