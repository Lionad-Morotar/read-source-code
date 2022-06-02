import { isBooleanAttr } from "../utils/index.js"

// * for debug
export const renderText = any => {
  const $pre = document.createElement('pre')
  const $text = document.createTextNode(JSON.stringify(any, null, 4))
  $pre.appendChild($text)
  return [$pre]
}

export const renderDOM = vnodes => {
  const render = vnode => {
    if (vnode.text) {
      return vnode.isComment
        ? document.createComment(vnode.text)
        : document.createTextNode(vnode.text)
    }
    const $el = document.createElement(vnode.tag)
    // console.log(this)
    if (vnode.data) {
      const { attrs = {} } = vnode.data
      console.log(vnode.tag, vnode.data)
      Object.entries(attrs).map(([k, v]) => {
        if (isBooleanAttr(k)) {
          v && $el.setAttribute(k, v)
        } else {
          $el.setAttribute(k, v)
        }
      })
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
  $els.innerHTML = ''
  // const doms = renderText(VNode)
  const doms = renderDOM.bind(this)(VNode)
  doms.map(x => $els.appendChild(x))
  return $els
}