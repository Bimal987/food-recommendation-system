const fs = require('fs');
console.log('Running simple test');
try {
  fs.writeFileSync('simple_test_out.txt', 'Hello form simple test');
  console.log('File written');
} catch (e) {
  console.error(e);
}
