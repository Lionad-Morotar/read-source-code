import config from '../config.js'

export * from './attr.js'

export function noop () {
  /* do nothing */
}

export const TODO = null

export function warn (msg) {
  if (config.warnHandler) {
    config.warnHandler(msg)
  } else if (!config.silent) {
    console.info(`[VUE WARN] ${msg}`)
  }
}

export function error (msg) {
  if (config.errorHandler) {
    config.errorHandler(msg)
  } else if (!config.silent) {
    throw new Error(`[VUE] ${msg}`)
  }
}

export function toString (obj) {
  return obj === null
    ? ''
    : obj instanceof Object
    ? JSON.stringify(obj, null, 2)
    : String(obj)
}

export function removeLastComma (str) {
  return str.replace(/,$/, '')
}

export function define(obj, key, value, enumerable) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
