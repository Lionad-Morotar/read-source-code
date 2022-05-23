import htmlParser from './compiler/htmlParser'

function Vue(options) {
  const { template } = options
  const ast = htmlParser(template)

  const nodes = document.createTextNode('testse')

  this.$mount = selector => {
    const el = document.querySelector(selector)
    el ? el.appendChild(nodes) : warn('[VUE] no element found')
  }
}
 
export default Vue