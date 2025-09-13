// Test script to verify server is running and static files are accessible
const http = require('http');

console.log('🧪 Testing GG Motors Server Status\n');

// Test 1: Check if server is running
console.log('1. Testing server connectivity...');
const testServerConnection = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Server is running');
          console.log(`   Status: ${jsonData.status}`);
          console.log(`   Message: ${jsonData.message}`);
          resolve(true);
        } catch (e) {
          console.log('❌ Server response is not valid JSON');
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Cannot connect to server');
      console.log(`   Error: ${err.message}`);
      console.log('   Make sure the backend server is running with: cd backend && npm run dev');
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Server connection timeout');
      resolve(false);
    });

    req.end();
  });
};

// Test 2: Check static file serving
const testStaticFile = (filename) => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/uploads/${filename}`,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      console.log(`\n2. Testing static file: ${filename}`);
      console.log(`   Status Code: ${res.statusCode}`);

      if (res.statusCode === 200) {
        console.log('✅ Static file served successfully');
        let size = 0;
        res.on('data', (chunk) => size += chunk.length);
        res.on('end', () => {
          console.log(`   File size: ${size} bytes`);
          resolve(true);
        });
      } else {
        console.log('❌ Static file not found or error');
        let errorData = '';
        res.on('data', (chunk) => errorData += chunk);
        res.on('end', () => {
          try {
            const error = JSON.parse(errorData);
            console.log(`   Error: ${error.error}`);
            console.log(`   Path: ${error.path}`);
            console.log(`   File exists: ${error.fileExists}`);
          } catch (e) {
            console.log(`   Response: ${errorData}`);
          }
          resolve(false);
        });
      }
    });

    req.on('error', (err) => {
      console.log(`❌ Cannot access static file: ${filename}`);
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ Timeout accessing static file: ${filename}`);
      resolve(false);
    });

    req.end();
  });
};

// Test 3: Check uploads directory
const testUploadsDirectory = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/test-uploads',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      console.log('\n3. Testing uploads directory...');
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Uploads directory accessible');
          console.log(`   Files found: ${jsonData.fileCount}`);
          if (jsonData.files && jsonData.files.length > 0) {
            console.log('   Files:');
            jsonData.files.forEach(file => console.log(`     - ${file}`));
          }
          resolve(true);
        } catch (e) {
          console.log('❌ Error accessing uploads directory');
          console.log(`   Response: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Cannot access uploads directory endpoint');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Timeout accessing uploads directory');
      resolve(false);
    });

    req.end();
  });
};

// Run all tests
async function runTests() {
  const serverOk = await testServerConnection();

  if (serverOk) {
    // Test static files
    await testStaticFile('test.txt');
    await testStaticFile('images-1757792250520-556892420.png');
    await testStaticFile('nonexistent-file.jpg');

    // Test uploads directory
    await testUploadsDirectory();
  }

  console.log('\n📋 Summary:');
  console.log('If you see errors above:');
  console.log('1. Make sure the backend server is running: cd backend && npm run dev');
  console.log('2. Check that the uploads directory exists and contains files');
  console.log('3. Verify that the server is running on port 5000');
  console.log('4. Check server console for detailed error messages');
  console.log('5. Try restarting the server if files were added after startup');
}

runTests().catch(console.error);