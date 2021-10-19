/** Promise Polyfill
 * 简短但不符合规范的 Promise
 */

function MyPromise (taskFn) {
  this.data = undefined
  this.cbs = []
  const resolve = data => {
    setTimeout(() => {
      this.data = data
      this.cbs.map(cb => cb(data))
    })
  }
  taskFn(resolve)
}

MyPromise.prototype.then = function (thenFn) {
  return new MyPromise(resolve => {
    this.cbs.push(() => {
      const res = thenFn(this.data)
      if (res instanceof MyPromise) {
        res.then(resolve)
      } else {
        resolve(res)
      }
    })
  })
}

/***************************************************************** Test Case */

// 正常流程
new MyPromise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 500)
})
  .then(data => {
    console.log(data)
    return new MyPromise(resolve => {
      setTimeout(() => {
        resolve(2)
      }, 500)
    })
  })
  .then(data => {
    console.log(data)
    return 3
  })
  .then(console.log)