const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const adminData = {
  name: 'Admin User',
  email: 'admin@admin.com',
  password: 'Admin@123',
  role: 'admin',
  phone: '1234567890',
  isEmailVerified: true,
  isActive: true
};

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete existing admin if exists
    const deleted = await User.deleteOne({ email: adminData.email });
    if (deleted.deletedCount > 0) {
      console.log('Deleted existing admin user');
    }

    console.log('Creating new admin user...');
    
    // Create new user instance
    const admin = new User(adminData);

    // The password will be automatically hashed by the pre-save middleware
    await admin.save();

    console.log('Admin user created successfully:', {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      isEmailVerified: admin.isEmailVerified,
      isActive: admin.isActive
    });

    // Verify the password can be matched
    const testPassword = await admin.matchPassword('Admin@123');
    console.log('Password verification test:', testPassword ? 'PASSED' : 'FAILED');

  } catch (error) {
    console.error('Error seeding admin:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the seeding function
seedAdmin(); 