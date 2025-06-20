const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role, // 👈 Include the user's role here
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
