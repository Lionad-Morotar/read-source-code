import { pushTarget, popTarget } from './dep'

let uid = 0

export default class Watcher {
  constructor (vm, fn, callback, options) {
    this.id = ++uid
    this.vm = vm
    this.options = options
    this.getter = fn
    this.cb = callback
    this.deps = new Set()
    this.value = this.get()
  }
  get () {
    let value = null
    pushTarget(this)
    value = this.getter.call(this.vm, this.vm)
    popTarget(this)
    return value
  }
  update () {
    const oldValue = this.value
    const newValue = this.get()
    if (oldValue !== newValue) {
      this.options.before && this.options.before.call(this.vm)
      this.cb.call(this.vm, newValue, oldValue)
      this.options.after && this.options.after.call(this.vm)
    }
  }
  addDep (dep) {
    this.deps.add(dep)
    dep.addSub(this)
  }
  tearDoen () {
    // TODO
  }
}