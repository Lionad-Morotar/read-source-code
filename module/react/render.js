import { warn, log } from './utils'

let root = null
let fiber = null

// polyfill for log
const requestIdleCallback = fn => setTimeout(() => { log('render count'), fn() }, 1000)

function createElement(node) {
  const { type, props } = node
  if (!type) warn('no type')
  if (!props) warn('no props')

  const $elem = document.createElement(type)
  Object.entries(props).map(([k, v]) => $elem[k] = v)
  return $elem
}

function renderLoop() {
  while (fiber) {
    const next = renderTick(fiber)
    fiber = next
  }
  if (!fiber && root) {
    commit(root)
    root = null
  }
  requestIdleCallback(renderLoop)
}

function renderTick() {
  const { node } = fiber
  if (!fiber.dom) {
    fiber.dom = createElement(node)
  }

  const children = [...node.children || []]
  children.reduce((prev, child) => {
    const newFiber = {
      node: child,
      parent: fiber,
    }
    if (prev) {
      prev.sibling = newFiber
    } else {
      fiber.child = newFiber
    }
    return newFiber
  }, null)

  if (fiber.child) {
    return fiber.child
  }

  let next = fiber
  while (next) {
    if (next.sibling) {
      return next.sibling
    }
    next = next.parent
  }
}

function commit (fiber) {
  (fiber.parent.dom || fiber.parent).appendChild(fiber.dom)
  fiber.child && commit(fiber.child)
  fiber.sibling && commit(fiber.sibling)
}

export function render(node, container) {
  container = container || document.getElementById('app')
  fiber = root = {
    node,
    parent: container,
  }
  requestIdleCallback(renderLoop)
}