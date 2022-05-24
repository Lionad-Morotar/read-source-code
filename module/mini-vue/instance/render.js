import VNode from '../vdom/vnode'

export default function initVueRender (Vue) {
  installRenderHelpers(Vue.prototype)
}

function installRenderHelpers (target) {
  target._c = createNode
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
