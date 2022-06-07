import { initState } from './state'
import { initEvent } from './event'
import { initRender } from './render'
import { initLifecycle, callHook } from './lifecycle'

import { info } from '../utils'

let uid = 0

export default function initMixin (Vue) {

  Vue.prototype._init = function (options) {
    this._uid = ++uid
    this._isVue = true
    this._renderProxy = this

    this.$options = options
    
    initLifecycle(this)
    initEvent(this)
    initRender(this)
    callHook(this, 'beforeCreate')
    initState(this)
    callHook(this, 'created')
  }

  Vue.prototype.$info = function (...args) {
    this.$options.info && info(...args)
  }

}