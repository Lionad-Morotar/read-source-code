import { initState } from './state'
import { initEvent } from './event'
import { initRender } from './render'
import { initLifecycle, callHook } from './lifecycle'

let uid = 0

export default function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    this._uid = ++uid
    this._isVue = true
    this._renderProxy = new Proxy(this, {
      get (target, key) {
        const data = target._data
        return data.hasOwnProperty(key)
          ? data[key]
          : target[key]
      },
      set (target, key, value) {
        const data = target._data
        data.hasOwnProperty(key)
          ? (data[key] = value)
          : (target[key] = value)
      }
    })

    this.$options = options
    
    initLifecycle(this)
    initEvent(this)
    initRender(this)
    callHook(this, 'beforeCreate')
    initState(this)
    callHook(this, 'created')
  }
}