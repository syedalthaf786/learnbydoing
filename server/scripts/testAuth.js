const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function testAuth() {
  try {
    // Verify environment variables are loaded
    console.log('Checking environment variables...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log('MONGO_URI is:', process.env.MONGO_URI);

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Successfully connected to MongoDB');

    // Test user credentials
    const testEmail = 'admin@admin.com';
    const testPassword = 'Admin@123';

    // Find the user
    const user = await User.findOne({ email: testEmail }).select('+password');
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    // Test direct bcrypt comparison
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log('Direct bcrypt password comparison:', isPasswordValid);

    // Test model's matchPassword method
    try {
      await user.matchPassword(testPassword);
      console.log('Model matchPassword method: Password is valid');
    } catch (error) {
      console.log('Model matchPassword method failed:', error.message);
    }

    // Check login attempts and lock status
    console.log('Login attempts:', user.loginAttempts);
    console.log('Lock until:', user.lockUntil);

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

testAuth(); 