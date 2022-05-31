import VNode from '../vdom/vnode'
import { toString } from '../utils'

export function initRender (vm) {
  vm._vnode = null
}

export default function renderMixin (Vue) {
  installRenderHelpers(Vue.prototype)

  // Vue.prototype.$nextTick

  Vue.prototype._render = function () {
    const vnodes = this.$options.render.call(this)
    this.$vnodes = vnodes
    return vnodes
  }
}

function installRenderHelpers (target) {
  target._c = createNode
  target._s = toString
  target._text = createTextNode
  target._comment = createCommentNode
}

function createNode (tag, data, children) {
  return new VNode(tag, data, children)
}

function createTextNode (text) {
  const node = new VNode()
  node.text = text
  return node
}

function createCommentNode (text) {
  const node = createTextNode(text)
  node.isComment = true
  return node
}