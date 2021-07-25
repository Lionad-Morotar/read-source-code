import { isHTMLTags } from './const'
import { warn } from './utils'

/* Create Nodes */

function h(...args) {
  return createNode(...args)
}
function createNode (tag, props, children = []) {
  children = Array.isArray(children) ? children : [children]
  // create textElement tag by default
  if (isHTMLTags(tag)) {
    return {
      type: tag,
      props,
      children: children.map(x => typeof x === 'object' ? x : createNode('span', { innerText: x }))
    }
  } else {
    return createNode('span', { ...props, innerText: tag })
  }
}

/* Create Elements */

function createElement (node) {
  const { type, props = {} } = node
  const children = [...node.children || []]
  const $elem = document.createElement(type)
  // Object.entries(props).map(([k, v]) => $elem.setAttribute(k, v))
  Object.entries(props).map(([k, v]) => $elem[k] = v)
  const $children = children.map(x => createElement(x))
  $children.map(x => $elem.appendChild(x))

  return $elem
}

/* Renders */

function render (node, container) {
  container = container || document.getElementById('app')
  const $elem = createElement(node)
  container.appendChild($elem)
}

/* Main */

if (globalThis.window) {
  render(h('div', { id: 'test' }, [h('a', {}, 'no click'), h('a', {}, 'no click')]))
}