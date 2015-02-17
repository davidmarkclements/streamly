var Readable = require('stream').Readable;
var through = require('through2');
var extend = require('extend');
var gfn = require('./graceful-generator');

var GeneratorFunction = gfn.constructor;
var GeneratorFunctionPrototype = gfn().constructor;


module.exports = streamly;
function _streamly(stream) {
  if (stream instanceof GeneratorFunctionPrototype) return src(stream)
  if (stream instanceof GeneratorFunction) return src(stream)
  if (stream instanceof Function) return thru(stream)
}

function streamly() {
  var all = arguments.length;
  var i = 0;
  var result = [];
  while(i < all) {
    result.push(_streamly(arguments[i++]))
  }
  return result;
}

streamly.src = src;
function src(g) {
  var r = new Readable;
  r._read = _read;

  if (g instanceof GeneratorFunctionPrototype) {
    return extend(g, r);
  }

  if (g instanceof GeneratorFunction) {
    extend(g.prototype, r);
    return g;
  }
}

streamly.thru = thru;
function thru (fn) {
  return extend(fn, _thru());
}


function _thru() {
  var fn;
  return through(function (data, enc, cb) {
    fn = fn || this;
    if (fn.length === 1) {
      return cb(null, fn(data))
    }
    fn(data, cb)
  });
}

function _read(size) {
  var result = this.next();
  this.push(result.value || null);  
} 
