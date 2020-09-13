/* eslint-disable */

import VNode from './vnode'

export function createElement(context, tag, data, children, normalizationType) {
  return _createElement(context, tag, data, children, normalizationType)
}

let vnode
export function _createElement(context, tag, data, children) {
  vnode = new VNode(tag, data, children, undefined, undefined, context)

  return vnode
}
