import { render } from './render'
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

/* Main */

if (globalThis.window) {
  // render(h('a', {}, 'no!'))
  render(h('div', { id: 'test' }, [h('a', {}, 'click?'), h('a', {}, 'no!')]))
}