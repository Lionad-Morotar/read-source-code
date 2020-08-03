function Promise (fns) {
  this.state = 'initial'
  this.thenFns = []
  const promise = new Proxy(this, {
    get (target, prop) {
      if (prop === 'then') {
        return then
      }
      return target[prop]
    }
  })

  function fulfilled () {
    this.state = 'fulfilled'
  }

  function then (cb) {
    this.thenFns.push(cb)
    return promise
  }
  function resolver (data) {
    fulfilled()
    const microTimeout = process && process.nextTick || queueMicrotask || (cb => setTimeout(cb, 0))
    microTimeout(() => {
      promise.thenFns.reduce((h, c) => c(h), data)
    })
  }

  fns(resolver)
  return promise
}

new Promise(resolve => {
  console.log(1)
  resolve(2)
}).then(data => {
  console.log(data)
  return 3
}).then(data => {
  console.log(data)
  return 4
})

// >>> 1
// >>> 2
// >>> 3
// 这玩意儿我写出来为什么这么短... 总之肯定有 n 多测试跑不通...
