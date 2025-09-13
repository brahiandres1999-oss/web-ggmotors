// Simple test for static file serving
const http = require('http');

console.log('🧪 Simple Static File Test\n');

// Test the text file first (should be simple)
const testTextFile = () => {
  console.log('Testing text file...');

  const req = http.get('http://localhost:5000/uploads/test.txt', (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`Content: ${data}`);
      console.log('✅ Text file test completed\n');
    });
  });

  req.on('error', (err) => {
    console.log(`❌ Text file error: ${err.message}\n`);
  });

  req.setTimeout(5000, () => {
    console.log('❌ Text file timeout\n');
    req.destroy();
  });
};

// Test an image file
const testImageFile = () => {
  console.log('Testing image file...');

  const req = http.get('http://localhost:5000/uploads/images-1757792250520-556892420.png', (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);

    let size = 0;
    res.on('data', (chunk) => size += chunk.length);
    res.on('end', () => {
      console.log(`Total bytes received: ${size}`);
      console.log('✅ Image file test completed\n');
    });
  });

  req.on('error', (err) => {
    console.log(`❌ Image file error: ${err.message}\n`);
  });

  req.setTimeout(10000, () => {
    console.log('❌ Image file timeout\n');
    req.destroy();
  });
};

// Test non-existent file
const testNonExistentFile = () => {
  console.log('Testing non-existent file...');

  const req = http.get('http://localhost:5000/uploads/nonexistent.jpg', (res) => {
    console.log(`Status: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`Response: ${data}`);
      console.log('✅ Non-existent file test completed\n');
    });
  });

  req.on('error', (err) => {
    console.log(`❌ Non-existent file error: ${err.message}\n`);
  });

  req.setTimeout(5000, () => {
    console.log('❌ Non-existent file timeout\n');
    req.destroy();
  });
};

// Run tests sequentially
setTimeout(testTextFile, 1000);
setTimeout(testImageFile, 3000);
setTimeout(testNonExistentFile, 6000);

console.log('Tests will run in sequence...\n');