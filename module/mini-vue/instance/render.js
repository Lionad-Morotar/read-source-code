import VNode from '../vdom/vnode.js'
import nextTick from '../observer/next-tick.js'
import { error, toString } from '../utils/index.js'

export function initRender (vm) {
  vm._vnode = null
}

export default function renderMixin (Vue) {
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = nextTick

  Vue.prototype._render = function () {
    return this.$vnodes = this.$options.render.call(this)
  }
}

function installRenderHelpers (target) {
  target._c = createNode
  target._s = toString
  target._text = createTextNode
  target._comment = createCommentNode
  target._f = renderInstanceFilter
  target._d = renderDynamicProp
  target._l = renderList
}

function renderInstanceFilter (name) {
  const filters = this.$options.filters || {}
  const filter = filters[name]
  return filter.bind(this) || error(`no filter named ${name} find`)
}

function createNode (tag, data, children) {
  // console.log(tag, data)
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

function renderDynamicProp (obj, values) {
  for (let i = 0, l = values.length; i < l; i += 2) {
    obj[values[i]] = values[i + 1]
  }
  return obj
}

function renderList(list, fn) {
  return list.map(fn)
}
