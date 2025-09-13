# Database Schema for GG Motors

This document outlines the MongoDB collections and their schemas for the GG Motors vehicle marketplace application.

## Vehicles Collection
- `_id`: ObjectId (auto-generated)
- `title`: String (required) - Title of the vehicle listing
- `description`: String - Detailed description
- `price`: Number (required) - Price in the local currency
- `year`: Number - Manufacturing year
- `mileage`: Number - Kilometers/miles driven
- `location`: String - Location of the vehicle
- `fuelType`: String - e.g., gasoline, diesel, electric, hybrid
- `transmission`: String - manual, automatic
- `color`: String - Vehicle color
- `condition`: String - new, used, excellent, good, fair
- `images`: Array of Strings - URLs or file paths to images
- `sellerId`: ObjectId (reference to Users collection)
- `category`: String - cars, motorcycles, trucks, etc.
- `brand`: String - Vehicle brand (e.g., Toyota, Honda)
- `model`: String - Vehicle model (e.g., Corolla, Civic)
- `createdAt`: Date - Listing creation timestamp
- `updatedAt`: Date - Last update timestamp

## Users Collection
- `_id`: ObjectId (auto-generated)
- `name`: String (required) - Full name
- `email`: String (required, unique) - Email address
- `password`: String (hashed) - Password hash
- `role`: String (default: 'user') - user, admin
- `profile`: Object
  - `phone`: String - Phone number
  - `address`: String - Address
  - `avatar`: String - Profile picture URL
- `createdAt`: Date - Account creation timestamp

## Transactions Collection
- `_id`: ObjectId (auto-generated)
- `buyerId`: ObjectId (reference to Users collection)
- `sellerId`: ObjectId (reference to Users collection)
- `vehicleId`: ObjectId (reference to Vehicles collection)
- `amount`: Number - Transaction amount
- `status`: String - pending, completed, cancelled
- `paymentMethod`: String - e.g., credit_card, paypal, bank_transfer
- `createdAt`: Date - Transaction timestamp

## Admin Data Collection (for reports and analytics)
- `_id`: ObjectId (auto-generated)
- `type`: String - sales_report, inventory_report, user_stats
- `data`: Object - Flexible object containing report data
- `createdAt`: Date - Report generation timestamp