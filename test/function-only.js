var streamly = require('../');
var stream = require('stream');
var assert = require('assert');

streamly(upper, asyncLower, src);

function src(s) {
  var outs = [s, 'SHOULD BE LOWER', s, '\n'];
  var r = new stream.Readable;
  r._read = function(size) {
    if (!outs.length) { return this.push(null); }
    this.push(outs.shift())
  }
  return r;
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