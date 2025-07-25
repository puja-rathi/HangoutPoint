const http = require('http');

http.get('http://localhost:3000', res => {
  const { statusCode } = res;
  if (statusCode === 200) {
    console.log('Test Passed!');
    process.exit(0);
  } else {
    console.log('Test Failed!');
    process.exit(1);
  }
});
