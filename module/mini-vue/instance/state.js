import { observe } from '../observer/index.js'

export function initState (vm) {
  vm._watchers = []
  const opts = vm.$options
  opts.data && initData(vm)
  // opts.computed && initComputed(vm)
  // opts.watch && initWatch(vm)
}

export default function stateMixin (Vue) {
  // Vue.prototype.$set = set
  // Vue.prototype.$delete = del
  // Vue.prototype.$watch = watch  
}

function initData (vm) {
  const data = getData(vm)
  vm._data = data
  observe(data)
  Object.keys(data).map(key => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
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