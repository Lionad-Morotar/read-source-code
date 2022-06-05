import { mountComponent } from '../instance/lifecycle'

import { compileToFunctions } from './compiler'
import patch from './patch'

/* current runtime platfrom is web only */
export default function runtimeMixin (Vue) {

  Vue.prototype.__patch__ = patch

  Vue.prototype.$mount = function (el) {
    el = el && document.querySelector(el)
    this.$options.code = compileToFunctions(this.$options.template)
    this.$options.render = function () {
      return new Function(this.$options.code).call(this._renderProxy)
    }
    mountComponent.call(this, el)
  }

}