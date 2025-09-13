// Test script to verify static file serving
const fs = require('fs');
const path = require('path');

console.log('🖼️ Testing Static File Serving\n');

// Check if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsDir);
console.log('Uploads directory exists:', fs.existsSync(uploadsDir));

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log('\nFiles in uploads directory:');
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file}`);
    console.log(`    Size: ${stats.size} bytes`);
    console.log(`    Modified: ${stats.mtime}`);
    console.log(`    URL: http://localhost:5000/uploads/${file}`);
    console.log('');
  });

  // Test specific files mentioned in the error
  const testFiles = [
    'images-1757792250520-556892420.png',
    'images-1757793039026-528102556.png',
    'images-1757794594498-144294069.webp'
  ];

  console.log('Testing specific files from error messages:');
  testFiles.forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    const exists = fs.existsSync(filePath);
    console.log(`  - ${filename}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    if (exists) {
      const stats = fs.statSync(filePath);
      console.log(`    Size: ${stats.size} bytes`);
      console.log(`    URL: http://localhost:5000/uploads/${filename}`);
    }
  });
} else {
  console.log('❌ Uploads directory does not exist!');
}

console.log('\n📋 Next Steps:');
console.log('1. Start the backend server: cd backend && npm run dev');
console.log('2. Test these URLs in your browser:');
console.log('   - http://localhost:5000/test-uploads');
console.log('   - http://localhost:5000/uploads/test.txt');
console.log('   - http://localhost:5000/uploads/images-1757792250520-556892420.png');
console.log('3. Check server console for debug logs');
console.log('4. If files still don\'t load, check:');
console.log('   - Server is running on port 5000');
console.log('   - No firewall blocking the port');
console.log('   - Browser cache (try Ctrl+F5)');
console.log('   - CORS issues (check browser console for CORS errors)');