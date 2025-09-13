# GG Motors - Vehicle Marketplace

## Overview

GG Motors is a scalable web application for buying and selling vehicles of all types, built with modern web technologies. The platform provides a user-friendly interface for browsing, filtering, and purchasing vehicles, along with features for sellers to list their vehicles.

## Features

- **User Authentication**: Complete registration and login system with JWT tokens and session management
- **Vehicle Listings**: Comprehensive listings with images, descriptions, and specifications
- **Advanced Filtering**: Filter vehicles by category, price, location, and more
- **Search Functionality**: Real-time search with brand and model matching
- **Sell Your Moto**: Complete form for users to list motorcycles with image upload
- **Shopping Cart**: Full cart functionality with persistence, add/remove items, and checkout
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **File Upload**: Image upload support for vehicle listings with validation
- **Transaction Management**: Complete transaction tracking and order history
- **Custom Color Palette**: Elegant beige and brown theme for enhanced user experience
- **Modular Architecture**: Clean, scalable code structure for future enhancements

## Color Palette

The application uses a custom color palette for a cohesive and elegant design:

- **Primary Background**: `#ffffff` (Pure White)
- **Secondary Background**: `#fffaeb` (Light Beige)
- **Accent Color**: `#f0f0d8` (Pale Green)
- **Neutral Borders**: `#cfcfcf` (Medium Gray)
- **Primary Text**: `#967c52` (Dark Brown)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (for vehicle images)

## Project Structure

```
gg-motors/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env            # Environment variables
├── frontend/
│   ├── public/
│   │   ├── index.html   # Main HTML file
│   │   ├── css/
│   │   │   └── styles.css  # Main stylesheet
│   │   └── js/
│   │       └── app.js      # Main JavaScript file
│   └── src/             # Additional source files
├── shared/              # Shared utilities
├── database-schema.md   # Database schema documentation
└── README.md           # This file
```

## Recent Updates & Fixes

### Version Improvements
- **Backend Error Handling**: Enhanced error logging and debugging for vehicle creation
- **Form Layout Fixes**: Resolved submit button visibility issues in image upload forms
- **Color Palette Integration**: Complete redesign with custom beige and brown theme
- **File Upload Optimization**: Improved image preview and form layout stability
- **Connection Error Fixes**: Resolved ERR_CONNECTION_RESET and ERR_NAME_NOT_RESOLVED issues
- **CORS Configuration**: Improved cross-origin request handling
- **Debug Tools**: Added comprehensive debugging page and enhanced error messages

### Specific Bug Fixes
- **500 Internal Server Error on POST /api/vehicles**: Fixed multer file upload path and JWT token validation
- **"Something went wrong!" Error**: Replaced with detailed, specific error messages
- **Submit Button Disappearing**: Implemented sticky positioning and fixed form layout
- **Connection Reset Errors**: Enhanced CORS configuration and error handling
- **Image Placeholder Loading**: Added fallback for missing hero background image

### Bug Fixes
- Fixed "Something went wrong!" error in motorcycle listing creation
- Resolved submit button disappearing when adding images to forms
- Improved form validation and user feedback
- Enhanced responsive design for mobile devices

## Debug Tools

### Debug Page
A comprehensive debug page is available at `debug.html` to test server connectivity and basic functionality:

- **Server Connection Tests**: Test root, health, and API endpoints
- **Authentication Tests**: Register and login test users
- **Vehicle Creation Tests**: Create test vehicles without complex forms
- **Real-time Debugging**: See detailed responses and error messages

### Testing Steps
1. Start the backend server: `cd backend && npm run dev`
2. Open `debug.html` in your browser
3. Test each section systematically
4. Check browser console for detailed logs
5. Use the results to identify specific issues

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/gg-motors
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Open `frontend/public/index.html` in your web browser
2. Or serve the frontend files using a local server

## API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles (with optional filters: category, brand, minPrice, maxPrice, location)
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create new vehicle (authenticated, supports file uploads)
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user and return JWT token
- `GET /api/users/profile` - Get user profile (authenticated)

### Transactions
- `GET /api/transactions` - Get all transactions (admin only)
- `GET /api/transactions/user/:userId` - Get user transactions (authenticated)
- `POST /api/transactions` - Create transaction (authenticated)
- `PUT /api/transactions/:id` - Update transaction status

### Authentication
All protected routes require `Authorization: Bearer <token>` header

## Database Schema

See `database-schema.md` for detailed database collection schemas.

## Future Enhancements

- **Framework Integration**: Migrate to React or Vue.js for better component management
- **Real-time Features**: WebSocket integration for live updates
- **Payment Integration**: Stripe/PayPal integration for secure payments
- **Admin Dashboard**: Comprehensive admin panel for managing listings and users
- **Image Upload**: Cloud storage integration (AWS S3, Cloudinary)
- **Advanced Search**: Full-text search with autocomplete
- **Mobile App**: React Native or Flutter mobile application
- **AI Recommendations**: Machine learning for vehicle recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.