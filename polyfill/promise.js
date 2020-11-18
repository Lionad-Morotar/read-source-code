/** Promise Polyfill
 * 目前是手糊的，没有按照规范实现
 * @see A+ 规范：https://www.ituring.com.cn/article/66566#gotocomment
 */

const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'
const microTimeout = (process && process.nextTick) || queueMicrotask || (cb => setTimeout(cb, 0))

function Promise(fns) {
  this.state = PENDING
  this.value = null
  this.reason = null
  this.thenFns = []
  this.rejectFns = []

  const promise = new Proxy(this, {
    get(target, prop) {
      if (prop === 'then') {
        return thenHandler
      }
      if (prop === 'catch') {
        return catchHandler
      }
      return target[prop]
    },
  })

  function thenHandler(valueRead, reasonRead) {
    if (promise.state === PENDING) {
      if (valueRead instanceof Function) {
        this.thenFns.push(valueRead)
      }
      if (reasonRead instanceof Function) {
        this.rejectFns.push(reasonRead)
      }
      return promise
    }
    return promise
  }

  function catchHandler(cb) {
    if (promise.state === PENDING) {
      this.rejectFns.push(cb)
      return promise
    }
  }

  function resolve(value) {
    if (promise.value) {
      throw new Error('onFulfilled can only be called once')
    }
    if (value === promise) {
      throw new TypeError('Value is equal to current promise')
    }
    return microTimeout(async () => {
      if (promise.state === PENDING) {
        promise.state = FULFILLED
        // TODO
        promise.value = value
        try {
          promise.thenFns.reduce((h, c) => c(h), promise.value)
        } catch (exception) {
          reject(exception)
        }
        return promise
      }
    })
  }

  function reject(reason) {
    if (promise.reason) {
      throw new Error('onRejected can only be called once.')
    }
    return microTimeout(() => {
      if ([PENDING, FULFILLED].includes(promise.state)) {
        promise.state = REJECTED
        promise.reason = reason
        try {
          promise.rejectFns.reduce((h, c) => c(h), reason)
        } catch (exception) {
          throw exception
        }
        return promise
      }
    })
  }

  try {
    fns(resolve, reject)
  } catch (exception) {
    reject(exception)
  }

  return promise
}

Promise.all = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('should be an array')
  }
  const results = []
  let counts = 0
  return new Promise((resolve, reject) => {
    promises.map((p, i) => {
      p.then(data => {
        results[i] = data
        counts++
        if (counts === promises.length) {
          return resolve(results)
        }
      }, err => {
        return reject(err)
      })
    })
  })
}

// 正常流程
// new Promise(resolve => {
//   console.log(1)
//   resolve(2)
// })
//   .then(data => {
//     console.log(data)
//     return 3
//   })
//   .then(data => {
//     console.log(data)
//   })
//   .catch(error => {
//     console.log('[ERR]', error)
//   })


// Promise.all 正常返回 Promises 运行完的结果
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 300)),
  new Promise(resolve => setTimeout(() => resolve(2), 200)),
  new Promise(resolve => setTimeout(() => resolve(3), 100)),
]).then(datas => {
  console.log('promise.all: ', datas)
})

// Promise.all 能捕获单个 Promise 报错
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 300)),
  new Promise(resolve => setTimeout(() => resolve(2), 200)),
  new Promise((resolve, reject) => reject('error'), 100),
]).then(datas => {
  console.log('promise.all: ', datas)
}).catch(error => {
  console.log(error)
})