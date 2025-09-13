# GG Motors - Testing Instructions

## Recent Fixes Verification

### 1. Backend Error Fix - "Something went wrong!" Error
**Issue**: Error when publishing motorcycles
**Fix**: Enhanced error logging and debugging in backend

**Test Steps**:
1. Start the backend server: `cd backend && npm run dev`
2. Test basic endpoints first:
   - Visit `http://localhost:5000/` - Should return API status
   - Visit `http://localhost:5000/health` - Should return health status
   - Visit `http://localhost:5000/test` - Should return test response
3. Open browser console (F12) to see detailed error logs
4. Try to publish a motorcycle with and without authentication
5. Check console for detailed error messages instead of generic "Something went wrong!"

**Expected Result**: Detailed error messages in console, proper error handling

### 2. Server Connection Issues
**Issue**: ERR_CONNECTION_RESET, ERR_NAME_NOT_RESOLVED
**Fix**: Improved CORS configuration and error handling

**Test Steps**:
1. Ensure MongoDB is running on port 27017
2. Start backend server with `npm run dev`
3. Check server logs for "MongoDB connected" message
4. Test endpoints with curl or browser:
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:5000/test
   ```

**Expected Result**: Server responds with JSON data, no connection errors

### 2. Submit Button Visibility Fix
**Issue**: Submit button disappears when adding images
**Fix**: Improved CSS layout with contained image preview area

**Test Steps**:
1. Open the "Sell Your Moto" form
2. Add multiple images using the file input
3. Verify the submit button remains visible and accessible
4. Check that images display properly in the preview area
5. Ensure the form layout doesn't break on different screen sizes

**Expected Result**: Submit button always visible, images contained in scrollable preview area

### 3. Color Palette Integration
**Issue**: Old blue color scheme
**Fix**: New beige and brown color palette applied

**Test Steps**:
1. Check header background is dark brown (#967c52)
2. Verify buttons use pale green (#f0f0d8) with dark brown text
3. Confirm secondary sections use light beige (#fffaeb)
4. Check borders use medium gray (#cfcfcf)
5. Verify text uses dark brown (#967c52)

**Expected Result**: Consistent color scheme throughout the application

## Full Application Testing

### Authentication Flow
1. Register a new user
2. Login with credentials
3. Verify user info appears in navigation
4. Try accessing protected features without login
5. Logout and verify session ends

### Vehicle Management
1. Login as a user
2. Open "Sell Your Moto" form
3. Fill all required fields
4. Upload multiple images
5. Submit the form
6. Verify vehicle appears in listings
7. Test filtering and search

### Shopping Cart
1. Browse vehicles
2. Add items to cart
3. Verify cart count updates
4. Open cart modal
5. Remove items
6. Test checkout process
7. Verify cart persists after page refresh

### Responsive Design
1. Test on different screen sizes
2. Verify mobile navigation
3. Check form layouts on small screens
4. Test image uploads on mobile

## Troubleshooting

### Common Issues
- **Backend not starting**: Ensure MongoDB is running and .env file exists
- **Images not uploading**: Check uploads directory permissions
- **Authentication failing**: Verify JWT_SECRET in .env file
- **CORS errors**: Check backend CORS configuration

### Debug Mode
Set `NODE_ENV=development` in .env for detailed logging

### Browser Console
Always check browser console for JavaScript errors and API responses

### Network Diagnostics
1. **Health Check**: Visit `http://localhost:5000/health` to verify server is running
2. **CORS Issues**: Check if frontend is served from a local server (not file:// protocol)
3. **Connection Reset**: May indicate MongoDB connection issues or server crashes
4. **500 Errors**: Check server logs for detailed error information

### New Debugging Features
- **Enhanced Error Messages**: More specific error messages instead of generic "Something went wrong!"
- **Loading States**: Visual feedback during form submissions
- **Network Error Handling**: Better handling of connection failures
- **Form Layout Stability**: Fixed submit button positioning with image uploads