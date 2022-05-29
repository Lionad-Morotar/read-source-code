export function initEvent (vm) {
  vm._events = Object.create(null)
}

export default function eventMixin (Vue) {

  Vue.prototype.$on = function (event, fn) {
    if (Array.isArray(event)) {
      event.map(x => this.$on(x, fn))
    } else {
      (this._events[event] || (this._events[event] = [])).push(fn)
    }
    return this
  }

  Vue.prototype.$once = function (event, fn) {
    const sideEffectFN = function (...args) {
      this.$off(event, fn)
      fn.apply(this, args)
    }
    sideEffectFN.fn = fn
    this.$on(event, sideEffectFN)
    return this
  }

  Vue.prototype.$off = function (event, fn) {
    if (!event && !fn) {
      this._events = Object.create(null)
      return this
    } 
    if (Array.isArray(event)) {
      event.map(x => this.$off(x, fn))
      return this
    }
    if (!fn) {
      this._events[event] = []
      return this
    }
    const fns = this._events[event]
    fns.splice(fns.indexOf(fn), 1)
    return this
  }

}