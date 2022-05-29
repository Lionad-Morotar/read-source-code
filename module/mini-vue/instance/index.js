import initMixin from './init'
import stateMixin from './state'
import eventMixin from './event'
import lifecycleMixin from './lifecycle'
import renderMixin from './render'
import runtimeMixin from '../runtime'
import htmlParser from '../compiler/parser/html-parser'
import templateParser from '../compiler/parser/template-parser'
import optimize from '../compiler/optimizer'
import generate from '../compiler/generator'

// * for debug
const renderText = any => {
  const $pre = document.createElement('pre')
  const $text = document.createTextNode(JSON.stringify(any, null, 4))
  $pre.appendChild($text)
  return $pre
}

const renderVNodes = vnodes => {
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

function Vue(options = {}) {
  this._init(options)

  const ast = htmlParser(options.template, { text: templateParser })
  optimize(ast)
  const code = generate(ast)
  const vnodes = new Function(code).call(this)
  const doms = renderVNodes(vnodes)
  this.$mount = selector => {
    const el = document.querySelector(selector)
    if (!el) {
      throw new Error(`[VUE] selector ${selector} is not found`)
    }
    doms.map(x => el.appendChild(x))
  }
}

initMixin(Vue)
stateMixin(Vue)
eventMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
 
export default Vue