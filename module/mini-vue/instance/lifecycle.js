export function initLifecycle (vm) {
  const options = vm.$options

  vm.$parent = options.parent
  vm.$root = vm.$parent ? vm.$parent.$root : vm
  vm.$children = []
  vm._watcher = null
}

export default function lifecycleMixin (Vue) {

  Vue.prototype._update = function (vnode) {
    const oldElements = Array.isArray(this.$els) ? this.$els : [this.$els]
    const oldVNode = this._vnode
    this._vnode = vnode
    this.$els = this.__patch__(this.$els, oldVNode, vnode)
    ;(Array.isArray(this.$els) ? this.$els : [this.$els]).map(x => x.__vue__ = this)
    oldElements && oldElements.map(x => delete x.__vue__)
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
    ;(Array.isArray(this.$els) ? this.$els : [this.$els]).map(x => delete x.__vue__)
    this.__patch__(this._vnode, null)
    this.$off()
    callHook(this, 'destroyed')
  }
}

export function mountComponent (el) {
  this.$els = el
  const updateComponent = () => this._update(this._render())
  callHook(this, 'beforeMount')
  // * TODO Watcher
  // const Watcher = () => { /* TODO */ }
  // new Watcher(this, updateComponent, {
  //   before () {
  //     callHook(this, 'beforeUpdate')
  //   }
  // })
  updateComponent()
  callHook(this, 'mounted')
  return this
}

export function callHook (vm, hookName) {
  const fns = vm.$options[hookName]
  fns && fns.length && fns.forEach(fn => fn.call(vm))
}