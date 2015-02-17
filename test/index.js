var gfn = require('../graceful-generator');

if (gfn.isDummy) {
  console.log('No generator support, testings function streams only\n');
  return require('./function-only')
}

console.log('Generator support, testing all function and generator streams');
require('./full.js')