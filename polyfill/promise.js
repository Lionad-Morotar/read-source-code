/** Promise Polyfill
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

new Promise(resolve => {
  console.log(1)
  resolve(2)
})
  .then(data => {
    console.log(data)
    return 3
  })
  .then(data => {
    console.log(data)
    return error
  })
  .catch(error => {
    console.log('[ERR]', error)
  })
