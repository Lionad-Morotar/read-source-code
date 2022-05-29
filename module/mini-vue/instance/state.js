export function initState (vm) {
  vm._watchers = []
  const opts = vm.$options
  opts.data && initData(vm)
  opts.computed && initComputed(vm)
  opts.watch && initWatch(vm)
}

export default function stateMixin (Vue) {
  // Vue.prototype.$set = set
  // Vue.prototype.$delete = del
  // Vue.prototype.$watch = watch  
}