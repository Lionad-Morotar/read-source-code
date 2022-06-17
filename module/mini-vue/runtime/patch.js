import { isBooleanAttr } from "../utils/index.js"

// TODO zip vnode with old vnode
const zip_todo = (x, y) => ([...x])

export default function patch ($els, oldVNode, VNode) {
  $els.innerHTML = ''
  // const doms = renderText(VNode)
  const doms = renderDOM.bind(this)(VNode, oldVNode)
  doms.map(x => $els.appendChild(x))
  return $els
}

const createElement = vnode => {
  if (vnode.text) {
    return vnode.isComment
      ? document.createComment(vnode.text)
      : document.createTextNode(vnode.text)
  }
  return document.createElement(vnode.tag)
}

function render (vnode) {
  const vm = this
  const $el = createElement(vnode)
  if (vnode.data) {
    const { attrs = {}, events = {}, style = {} } = vnode.data
    // * for debug
    // console.log(vnode.tag, vnode.data)
    Object.entries(attrs).map(([k, v]) => { 
      if (isBooleanAttr(k)) {
        v && $el.setAttribute(k, v)
      } else {
        $el.setAttribute(k, v)
      }
    })
    Object.entries(events).map(([k, v]) => {
      $el.addEventListener(k, v.bind(vm))
    })
    Object.entries(style).map(([k, v]) => {
      if (v === 'unset') {
        return
      } else {
        $el.style.setProperty(k, v)
      }
    })
  }
  if (vnode.children && vnode.children.length) {
    const $children = vnode.children.map(render.bind(vm))
    $children.map(x => $el.appendChild(x))
  }
  return $el
}

function renderDOM (vnodes, oldVNodes) {
  const renderBinded = render.bind(this)
  // console.log(ziped)
  return vnodes.map(renderBinded)
}

// * for debug
const renderText = any => {
  const $pre = document.createElement('pre')
  const $text = document.createTextNode(JSON.stringify(any, null, 4))
  $pre.appendChild($text)
  return [$pre]
}
