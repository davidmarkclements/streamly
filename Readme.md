# Streamly

Imagine a world where:

* Functions through streams
* Generators are source streams

Streamly is that world. 

## Method

Streamly doesn't touch native global prototypes, it's safe.
It extends an individual function or generator instance with
a stream instance, leaving native stuff intact and untouched.

## Compatibility

Streamly detects generator support, if the environment doesn't
support generators, then you still get function-stream support.

## Example

```javascript
var streamly = require('streamly');
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
  .pipe(process.stdout)

```

## API

### `streamly(...) => Array`

```javascript
streamly(myFunc, myGen, myGen2(), myAsyncFunc)
```

Pass in both Generators and Functions as arguments,
the `streamly` function will delegate to `src` or `thru`
accordingly. 

Returns an array of the now-decorated inputs.

### `streamly.src(Generator) => Generator`

```javascript
streamly
  .src(function * () { yield 'inline is fine'; })()
  .pipe(process.stdout)
```

Decorates a `GeneratorFunction`, or the iterable object
which a generator returns, with `Readable` stream
capabilities.

Returns the input, after decoration has occurred.

The result of `streamly.src` must be called before 
a stream is instantiated, unless the argument is an 
iterable object.


### `streamly.thru(Function) => Function`

```javascript
var streamly = require('./')
streamly.src(count)
function * count() { yield '1'; yield '2'; yield '3'; }

streamly.thru(wait)
function wait(n, cb) { 
  setTimeout(function () { 
    cb(null, 'waited ' + n + '\n')
  }, n)
}

count()
  .pipe(streamly.thru(function (n) { return n*100+''; }))
  .pipe(wait)
  .pipe(process.stdout) 
```

Decorates a `Function` with `Transform` stream capabilities.

If the function accepts a single parameter, then 
the through stream is considered synchronous. Which means,
the return value of the function is piped into the
next stream.

If the function accepts two parameters, the through
stream is considered to be asynchonous. That is, the 
values are passed onto the next stream via the second
parameter of the function, by calling it with the
signature `cb(err, value)`.

Returns the input, after decoration has occurred.


## Sponsorship

* Sponsored by nearForm



