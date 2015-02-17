var streamly = require('../');
var stream = require('stream');
var assert = require('assert');

streamly(upper, asyncLower, src);

function * src(s) {
  yield s;
  yield 'SHOULD BE LOWER'
  yield s;
  yield '\n';
}

function upper(s) { return (s+'').toUpperCase(); }

function asyncLower(s, cb) {
  setTimeout(function () {
    s += '';
    cb(null, s === 'SHOULD BE UPPER' ? s : s.toLowerCase())  
  }, 500);
}

src('should be upper')
  .pipe(upper)
  .pipe(asyncLower)
  .pipe(validate('SHOULD BE UPPERshould be lowerSHOULD BE UPPER'))


function validate(target, timeout) {
  var validator = new stream.Writable;
  validator.timeout = timeout || 2000;
  validator.data = '';
  validator._write = function (data, enc, cb) {
    this.data += data;
    cb();
  }
  validator.on('pipe', function () {
    setTimeout(function() {
      assert.equal(validator.data, target);
      console.log('Test passed:', validator.data);
    }, validator.timeout);
  })
  return validator;
}