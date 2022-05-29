import initMixin from './init'
import stateMixin from './state'
import eventMixin from './event'
import lifecycleMixin from './lifecycle'
import renderMixin from './render'
import runtimeMixin from '../runtime'

function Vue(options = {}) {
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
runtimeMixin(Vue)
 
export default Vue