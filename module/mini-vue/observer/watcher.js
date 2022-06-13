import { pushTarget, popTarget } from './dep.js'
import { queueWatcher } from './scheduler.js'
import { TODO } from '../utils/index.js'

let uid = 0

export default class Watcher {
  constructor (vm, expOrFn, callback, options) {
    this.id = ++uid
    this.vm = vm
    this.options = options || {}
    this.expOrFn = expOrFn
    this.cb = callback
    this.sync = TODO
    this.deps = new Set()
    this.value = this.get()
  }
  get () {
    let value = null
    pushTarget(this)
    value = this.expOrFn instanceof Function
      ? this.expOrFn.call(this.vm, this.vm)
      : this.vm[this.expOrFn]
    popTarget(this)
    return value
  }
  update () {
    if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
  run () {
    const oldValue = this.value
    this.value = this.get()
    if (oldValue !== this.value) {
      this.options.before && this.options.before.call(this.vm)
      this.cb.call(this.vm, this.value, oldValue)
      this.options.after && this.options.after.call(this.vm)
    }
  }
  addDep (dep) {
    this.deps.add(dep)
    dep.addSub(this)
  }
  teardown () {
    [...this.deps].map(dep => {
      dep.removeSub(this)
    })
    this.deps.clear()
  }
}