import htmlParser from './compiler/htmlParser'
import templateParser from './compiler/templateParser'
import optimizer from './compiler/optimizer'

function Vue(options) {
  const { template } = options
  const ast = optimizer(htmlParser(template, {
    text: templateParser
  }))

  const render = ast => document.createTextNode('TODO')
  const nodes = render(ast)

  this.$mount = selector => {
    const el = document.querySelector(selector)
    el ? el.appendChild(nodes) : warn('[VUE] no element found')
  }
}
 
export default Vue