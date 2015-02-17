# Streamly

Imagine a world where:

* Functions through streams
* Generators are source streams

Streamly is that world. 

## Compatibility

Streamly detects generator support, if the environment doesn't
support generators, then you still get function-stream support.


## Example

```javascript
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

### `streamly(...)`

Pass in both Generators and Functions as arguments,
the `streamly` function will delegate to `src` or `thru`
accordingly.

### `streamly.src(Generator)`

Decorates a `GeneratorFunction`, or the iterable
which the generator returns, with `Readable` stream
capabilities.


### `streamly.thru(Function)`

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

## Kudos

### Sponsorship

* Sponsored by nearForm



