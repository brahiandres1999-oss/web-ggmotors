const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  mileage: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'other']
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'other']
  },
  color: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'excellent', 'good', 'fair', 'poor'],
    default: 'used'
  },
  images: [{
    type: String
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['cars', 'motorcycles', 'trucks', 'other'],
    default: 'cars'
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
vehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);