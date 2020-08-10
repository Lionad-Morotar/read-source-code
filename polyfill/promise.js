const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const microTimeout = (process && process.nextTick) || queueMicrotask || (cb => setTimeout(cb, 0))

function Promise(fns) {
  this.state = PENDING
  this.thenFns = []
  this.rejectFns = []

  const promise = new Proxy(this, {
    get(target, prop) {
      if (prop === 'then') {
        return thenable
      }
      if (prop === 'catch') {
        return catchable
      }
      return target[prop]
    },
  })

  function thenable(cb) {
    if (promise.state === PENDING) {
      this.thenFns.push(cb)
      return promise
    }
    throw Error('Promise has Done')
  }

  function catchable(cb) {
    if (promise.state === PENDING) {
      this.rejectFns.push(cb)
      return promise
    }
  }

  function resolve(data) {
    return microTimeout(() => {
      if (promise.state === PENDING) {
        promise.state = FULFILLED
        microTimeout(() => {
          try {
            promise.thenFns.reduce((h, c) => c(h), data)
          } catch (err) {
            reject(err)
          }
        })
        return promise
      }
    })
  }

  function reject(err) {
    return microTimeout(() => {
      if ([PENDING, FULFILLED].includes(promise.state)) {
        promise.state = REJECTED
        microTimeout(() => {
          promise.rejectFns.reduce((h, c) => c(h), err)
        })
        return promise
      }
    })
  }

  try {
    fns(resolve, reject)
  } catch (err) {
    reject(err)
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
