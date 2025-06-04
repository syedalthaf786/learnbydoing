const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'mentor', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  profilePicture: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: String,
  lastPasswordChange: Date,
  passwordHistory: [{
    password: String,
    changedAt: Date
  }],
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Store password history
    if (this.passwordHistory) {
      this.passwordHistory = this.passwordHistory.slice(0, 4); // Keep last 5 passwords
      this.passwordHistory.unshift({
        password: hashedPassword,
        changedAt: new Date()
      });
    } else {
      this.passwordHistory = [{
        password: hashedPassword,
        changedAt: new Date()
      }];
    }

    this.password = hashedPassword;
    this.lastPasswordChange = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    if (this.lockUntil && this.lockUntil > Date.now()) {
      throw new Error('Account is locked. Please try again later.');
    }
    
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    
    if (!isMatch) {
      this.loginAttempts += 1;
      if (this.loginAttempts >= 5) {
        this.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      }
      await this.save();
      throw new Error('Invalid credentials');
    }

    // Reset login attempts on successful login
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save();
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Check if password was used before
userSchema.methods.isPasswordUsedBefore = async function(password) {
  for (const historyEntry of this.passwordHistory) {
    if (await bcrypt.compare(password, historyEntry.password)) {
      return true;
    }
  }
  return false;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);