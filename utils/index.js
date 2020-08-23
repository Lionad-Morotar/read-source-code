function isFunction(obj) {
  return obj && typeof obj === 'function'
}

function isObject(obj) {
  const type = typeof obj
  return obj && (type === 'object' || type === 'function')
}

function makeMap(arr) {
  return arr.reduce((h, c) => ((h[c] = true), h), {})
}

function deepClone(obj) {
  const isObj = isObject(obj)
  if (!isObj) return obj
  const isFn = isFunction(obj)
  if (isFn) return obj
  const isArr = Array.isArray(obj)
  const newObj = isArr ? [] : {}
  Object.keys(obj).map(key => {
    newObj[key] = isObj ? deepClone(obj[key]) : obj[key]
  })
  return newObj
}

export default {
  makeMap,
  deepClone,
}
