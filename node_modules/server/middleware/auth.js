
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database to get the latest tier information
    const user = await User.findById(decoded.user.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    req.user = user; // Assign the full user object from the database
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
