const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5000', 'http://127.0.0.1:5000', 'null'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log(`=== SERVER STARTUP ===`);
console.log(`Static files will be served from: ${uploadsPath}`);
console.log(`Uploads directory exists:`, require('fs').existsSync(uploadsPath));

// List files in uploads directory at startup
if (require('fs').existsSync(uploadsPath)) {
  const files = require('fs').readdirSync(uploadsPath);
  console.log(`Files in uploads directory: ${files.length}`);
  files.forEach(file => console.log(`  - ${file}`));
}

app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=31536000');
    console.log(`=== SERVING STATIC FILE ===`);
    console.log(`File: ${filePath}`);
    console.log(`URL: ${res.req.originalUrl}`);
  }
}));

// Debug middleware for static files (AFTER static middleware - only runs if static doesn't handle)
app.use('/uploads', (req, res) => {
  console.log(`=== STATIC FILE DEBUG (FALLTHROUGH) ===`);
  console.log(`Path: ${req.path}`);
  console.log(`Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  console.log(`Method: ${req.method}`);

  // Check if file exists
  const fs = require('fs');
  const filePath = path.join(__dirname, '..', 'uploads', req.path);

  console.log(`Checking file: ${filePath}`);
  console.log(`File exists:`, fs.existsSync(filePath));

  if (fs.existsSync(filePath)) {
    console.log(`File exists but static middleware didn't serve it!`);
    const stats = fs.statSync(filePath);
    console.log(`File size: ${stats.size} bytes`);
    console.log(`File modified: ${stats.mtime}`);

    // Try to serve the file manually as fallback
    console.log(`Attempting manual file serve...`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Manual file serve failed:`, err);
        res.status(500).json({
          error: 'File exists but cannot be served',
          path: req.path,
          fullPath: filePath,
          serveError: err.message
        });
      } else {
        console.log(`Manual file serve successful`);
      }
    });
  } else {
    console.log(`File NOT found at: ${filePath}`);
    res.status(404).json({
      error: 'File not found',
      path: req.path,
      fullPath: filePath,
      fileExists: false
    });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gg-motors', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GG Motors API',
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint for debugging
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    server: 'GG Motors API',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint for uploads directory
app.get('/test-uploads', (req, res) => {
  const fs = require('fs');
  const path = require('path');

  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      return res.status(404).json({
        message: 'Uploads directory does not exist',
        uploadsPath: uploadsDir
      });
    }

    const files = fs.readdirSync(uploadsDir);

    res.json({
      message: 'Uploads directory accessible',
      uploadsPath: uploadsDir,
      files: files,
      fileCount: files.length,
      filesWithDetails: files.map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        return {
          name: filename,
          size: stats.size,
          modified: stats.mtime,
          url: `/uploads/${filename}`
        };
      })
    });
  } catch (error) {
    console.error('Error accessing uploads directory:', error);
    res.status(500).json({
      message: 'Error accessing uploads directory',
      error: error.message
    });
  }
});

// Import routes
const vehicleRoutes = require('./routes/vehicles');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

// Use routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Unexpected file field.' });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: 'Validation Error', errors: messages });
  }

  // Handle cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid data format.' });
  }

  // Default error
  res.status(500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});