const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user account is active
const isActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact support.'
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = { protect, authorize, isActive };