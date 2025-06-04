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

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: adminData.email });
    
    if (!adminExists) {
      // Hash password before creating admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create admin user with hashed password
      const admin = await User.create({
        ...adminData,
        password: hashedPassword
      });

      console.log('Admin user seeded successfully:', {
        id: admin._id,
        email: admin.email,
        role: admin.role
      });
    } else {
      console.log('Admin user already exists:', {
        id: adminExists._id,
        email: adminExists.email,
        role: adminExists.role
      });
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    throw error; // Propagate error for better handling
  }
};

module.exports = seedAdmin; 