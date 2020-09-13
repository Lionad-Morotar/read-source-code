export function createElm(vnode) {
  const tag = vnode.tag
  vnode.elm = document.createElement(tag)

  return vnode
}
