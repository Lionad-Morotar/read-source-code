/* Polyfills */
/**
 * Instanceof Operator
 * @see https://tc39.es/ecma262/#sec-instanceofoperator
 */
function _instanceof (val, fn) {
  const hasInstance = fn[Symbol.hasInstance]
  if (hasInstance) {
    return fn[Symbol.hasInstance](val)
  }
  const proto = fn.prototype
  while ((val = Object.getPrototypeOf(val))) {
    if (val === proto) {
      return true
    }
  }
  return false
}

/* Test Cases */

const assert = require('assert')

function God () {}
function Person () {}
function Programmer () {}

Programmer.prototype = new Person()

const lionad = new Programmer()

assert(_instanceof(lionad, Person) === true)
assert(_instanceof(lionad, Programmer) === true)

class GodMake {
  static [Symbol.hasInstance] () {
    return true
  }
}

assert(_instanceof(lionad, God) === false)
assert(_instanceof(lionad, GodMake) === true)
