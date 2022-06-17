import templateParser from '../../../template-parser/index'

const plugins = []

const parser = {
  parse (astNode) {
    const nodeData = templateParser.parseText(astNode.data)
    plugins.map(plugin => plugin(nodeData))
    return nodeData
  },
  extend (fn) {
    plugins.push(fn)
  }
}

export default parser