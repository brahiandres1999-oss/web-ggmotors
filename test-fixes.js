// Test script to verify the fixes for GG Motors issues
const fs = require('fs');
const path = require('path');

console.log('🧪 GG Motors - Testing Fixes\n');

// Test 1: Check if uploads directory exists and has files
console.log('1. Testing uploads directory...');
const uploadsDir = path.join(__dirname, 'uploads');

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log(`✅ Uploads directory exists with ${files.length} files:`);
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${stats.size} bytes)`);
  });
} else {
  console.log('❌ Uploads directory does not exist');
}

// Test 2: Check backend server configuration
console.log('\n2. Testing backend configuration...');
try {
  const serverPath = path.join(__dirname, 'backend', 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');

  if (serverContent.includes("express.static(path.join(__dirname, 'uploads')")) {
    console.log('✅ Static file serving is configured correctly');
  } else {
    console.log('❌ Static file serving configuration may be incorrect');
  }

  if (serverContent.includes("app.use('/uploads',")) {
    console.log('✅ Uploads route is configured');
  } else {
    console.log('❌ Uploads route is missing');
  }
} catch (error) {
  console.log('❌ Error reading server configuration:', error.message);
}

// Test 3: Check frontend image URL construction
console.log('\n3. Testing frontend image URL construction...');
try {
  const appPath = path.join(__dirname, 'frontend', 'public', 'js', 'app.js');
  const appContent = fs.readFileSync(appPath, 'utf8');

  if (appContent.includes('SERVER_BASE') && appContent.includes('SERVER_BASE}${vehicle.images[0]}')) {
    console.log('✅ Frontend image URL construction is correct');
  } else {
    console.log('❌ Frontend image URL construction may be incorrect');
  }
} catch (error) {
  console.log('❌ Error reading frontend configuration:', error.message);
}

// Test 4: Check JWT token handling
console.log('\n4. Testing JWT token handling...');
try {
  const vehiclesPath = path.join(__dirname, 'backend', 'routes', 'vehicles.js');
  const vehiclesContent = fs.readFileSync(vehiclesPath, 'utf8');

  if (vehiclesContent.includes('req.user.userId')) {
    console.log('✅ Backend uses correct JWT token structure');
  } else {
    console.log('❌ Backend JWT token handling may be incorrect');
  }
} catch (error) {
  console.log('❌ Error reading vehicles route:', error.message);
}

console.log('\n📋 Next Steps:');
console.log('1. Start the backend server: cd backend && npm run dev');
console.log('2. Test the /test-uploads endpoint: http://localhost:5000/test-uploads');
console.log('3. Test static file serving: http://localhost:5000/uploads/test.txt');
console.log('4. Open debug-image-test.html for comprehensive testing');
console.log('5. Try creating a vehicle with images to test the full flow');

console.log('\n🔧 If issues persist, check:');
console.log('- MongoDB connection');
console.log('- File permissions on uploads directory');
console.log('- JWT_SECRET in .env file');
console.log('- Browser console for detailed error messages');