const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Vehicle = require('../models/Vehicle');
const { auth } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all vehicles with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, location } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (location) query.location = new RegExp(location, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const vehicles = await Vehicle.find(query).populate('sellerId', 'name email');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('sellerId', 'name email phone');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new vehicle
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('=== VEHICLE CREATION REQUEST ===');
    console.log('Received vehicle data:', req.body);
    console.log('Authenticated user:', req.user);
    console.log('Uploaded files:', req.files ? req.files.length : 0);

    // Validate required fields
    const requiredFields = ['title', 'brand', 'model', 'price'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }

    const vehicleData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      vehicleData.images = req.files.map(file => `/uploads/${file.filename}`);
      console.log('Image paths:', vehicleData.images);
    }

    // Ensure sellerId matches authenticated user
    if (!req.user || !req.user.userId) {
      console.error('No authenticated user found');
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    vehicleData.sellerId = req.user.userId;
    console.log('Final vehicle data:', vehicleData);

    // Validate data before saving
    const vehicle = new Vehicle(vehicleData);
    const validationError = vehicle.validateSync();

    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        message: 'Error de validación',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    const newVehicle = await vehicle.save();
    console.log('Vehicle saved successfully:', newVehicle._id);
    res.status(201).json(newVehicle);

  } catch (err) {
    console.error('=== VEHICLE CREATION ERROR ===');
    console.error('Error type:', err.constructor.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);

    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Error de validación de datos',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Formato de datos inválido' });
    }

    if (err.code === 11000) {
      return res.status(400).json({ message: 'Datos duplicados' });
    }

    res.status(500).json({
      message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
  }
});

// PUT update vehicle
router.put('/:id', async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;