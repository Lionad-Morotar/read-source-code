import { createElement } from '../vdom/create-element'

export function initRender(vm) {
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  return vm
}
