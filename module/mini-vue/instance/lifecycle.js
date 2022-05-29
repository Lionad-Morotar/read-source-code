export function initLifecycle (vm) {
  const options = vm.$options

  vm.$parent = options.parent
  vm.$root = vm.$parent ? vm.$parent.$root : vm
  vm.$children = []
  vm._watcher = null
}

export default function lifecycleMixin (Vue) {

  Vue.prototype._update = function (vnode) {
    const oldElement = this.$el
    const oldVNode = this._vnode
    this._vnode = vnode
    this.$el = this.__patch__(oldVNode, vnode)
    this.$el.__vue__ = this
    if (oldElement) {
      delete oldElement.__vue__
    }
  }

  // Vue.prototype.$forceUpdate

  Vue.prototype.$destroy = function () {
    callHook(this, 'beforeDestroy')
    if (this.$parent) {
      const idx = this.$parent.$children.findIndex(x => x === this)
      if (idx > -1) {
        this.$parent.$children.splice(idx, 1)
      }
    }
    this._watcher && this._watcher.teardown()
    this._watchers && this._watchers.forEach(x => x.teardown())
    this.$el && delete this.$el.__vue__
    this.__patch__(this._vnode, null)
    this.$off()
    callHook(this, 'destroyed')
  }
}

export function callHook (vm, hookName) {
  const fns = vm.$options[hookName]
  fns && fns.length && fns.forEach(fn => fn.call(vm))
}