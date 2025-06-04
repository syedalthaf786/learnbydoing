const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const seedAdmin = require('./config/seedAdmin');
const path = require("path");
// Load environment variables
dotenv.config();
const _dirname=path.resolve()
// Check for required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
requiredEnvVars.forEach((var_) => {
  if (!process.env[var_]) {
    console.error(`Error: ${var_} is not defined in environment variables`);
    process.exit(1);
  }
});

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Logging HTTP requests

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require("./routes/projectRoute");
const courseRoutes = require('./routes/CourseRoutes'); // Added course routes

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/courses', courseRoutes); // Mounted courses endpoint
app.use(express.static(path.join(_dirname,"/frontend/build")))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","build","index.html"))
})
// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed admin user after successful connection
    await seedAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);

  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Something went wrong!',
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => process.exit(1));
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port or stop the existing server.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
});
