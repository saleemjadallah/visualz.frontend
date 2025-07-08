const http = require('http');

const checkServer = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    console.log(`Server status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response length: ${data.length} bytes`);
      if (data.includes('overlapping') || data.includes('multiple')) {
        console.log('⚠️  Potential overlapping content detected');
      } else {
        console.log('✅ Server response looks clean');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Server not responding:', error.message);
  });

  req.end();
};

console.log('Testing server at http://localhost:3000...');
checkServer();