try {
  module.exports = Function('return (function *() {})')();
} catch(e) {
  function dummy(){return dummy;}
  dummy.isDummy = true;
  dummy.constructor = dummy;
  module.exports = dummy;
}
