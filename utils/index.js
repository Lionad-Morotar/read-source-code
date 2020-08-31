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

// polyfill for "for await ... of"
async function forAwait(datas, cb) {
  let i = -1
  const ret = []
  async function handleNext() {
    const handle = datas[++i]
    if (handle) {
      ret.push(await cb(datas[i]))
      await handleNext()
    }
  }
  await handleNext()
  return ret
}

// 将函数延迟到下一帧执行
async function nextFrame(cb) {
  let resolver = null
  let promise = new Promise(async resolve => (resolver = resolve))
  const wrapper = async (...args) => {
    resolver(await cb(...args))
  }
  requestAnimationFrame(wrapper)
  return promise
}

function nextFrameCB(cb) {
  return async (...args) => {
    return await nextFrame(cb.bind(null, ...args))
    // return await new Promise(resolve => {
    //   setTimeout(async () => {
    //     resolve(await nextFrame(cb.bind(null, ...args)))
    //   }, 200)
    // })
  }
}

let requestFrameStore = null
function requestAnimationFrame(cb) {
  const fn =
    requestFrameStore ||
    (requestFrameStore =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      })
  return fn(cb)
}

let cancelFrameStore = null
function cancelAnimationFrame(id) {
  const fn =
    cancelFrameStore ||
    (cancelFrameStore =
      window.cancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame ||
      window.oCancelRequestAnimationFrame ||
      window.msCancelRequestAnimationFrame ||
      clearTimeout)
  return fn(id)
}

export default {
  makeMap,
  deepClone,
  forAwait,
  nextFrame,
  nextFrameCB,
  requestAnimationFrame,
  cancelAnimationFrame,
}
