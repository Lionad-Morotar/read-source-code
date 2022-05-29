// * for debug
export const rednerText = any => {
  const $pre = document.createElement('pre')
  const $text = document.createTextNode(JSON.stringify(any, null, 4))
  $pre.appendChild($text)
  return $pre
}

export const renderDOM = vnodes => {
  const render = vnode => {
    if (vnode.text) {
      return vnode.isComment
        ? document.createComment(vnode.text)
        : document.createTextNode(vnode.text)
    }
    const $el = document.createElement(vnode.tag)
    if (vnode.data) {
      const { attrs } = vnode.data
      if (attrs) {
        Object.entries(attrs).map(([k, v]) => $el.setAttribute(k, v))
      }
    }
    if (vnode.children && vnode.children.length) {
      const $children = vnode.children.map(render)
      $children.map(x => $el.appendChild(x))
    }
    return $el
  }
  return vnodes.map(render)
}

export default function patch ($els, oldVNode, VNode) {
  const doms = renderDOM(VNode)
  doms.map(x => $els.appendChild(x))
  return $els
}