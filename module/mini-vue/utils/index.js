export function noop () {
  /* do nothing */
}

export function error (msg) {
  throw new Error(`[VUE] ${msg}`)
}

export function toString (obj) {
  return obj === null
    ? ''
    : obj instanceof Object
    ? JSON.stringify(obj, null, 2)
    : String(obj)
}

export function define(obj, key, value, enumerable) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
