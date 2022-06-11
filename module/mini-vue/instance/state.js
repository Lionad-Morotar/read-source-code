import { defineReactive, observe } from '../observer/index.js'
import Watcher from '../observer/watcher.js'

export function initState (vm) {
  vm._watchers = []
  const opts = vm.$options
  opts.data && initData(vm)
  opts.methods && initMethods(vm)
  opts.watch && initWatch(vm)
  // opts.computed && initComputed(vm)
}

export default function stateMixin (Vue) {
  
  Vue.prototype.$set = set
  Vue.prototype.$del = del

  Vue.prototype.$watch = function watch (expOrFn, cb) {
    const watcher = new Watcher(this, expOrFn, cb)
    this._watchers.push(watcher)
    return function unWatch () {
      watcher.teardown()
    }
  }
}

function initData (vm) {
  const data = getData(vm)
  vm._data = data
  observe(data)
  Object.keys(data).map(key => {
    Object.defineProperty(vm, key, {
      enumerable: false,
      configurable: false,
      get () {
        return data[key]
      },
      set (nv) {
        data[key] = nv
      }
    })
  })
}

function getData (vm) {
  const dataOpts = vm.$options.data || (() => ({}))
  const result = dataOpts.call(vm)
  return result
}

function initMethods (vm) {
  const methods = vm.$options.methods
  Object.keys(methods).map(key => {
    Object.defineProperty(vm, key, {
      enumerable: false,
      configurable: false,
      get () {
        return methods[key]
      },
      set (nv) {
        methods[key] = nv
      }
    })
  })
}

function initWatch (vm) {
  Object.entries(vm.$options.watch).map(([key, callback]) => {
    vm.$watch(key, callback)
  })
}

function set (target, key, val) {
  const ob = observe(target)
  Array.isArray(target)
    ? target.splice(key, 1, val)
    : defineReactive(ob.value, key, val)
  ob.dep.notify()
}

function del (target, key) {
  const ob = observe(target)
  Array.isArray(target)
    ? target.splice(key, 1)
    : delete ob.value[key]
  ob.dep.notify()
}
