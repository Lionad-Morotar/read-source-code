import LRU from '../../data-structure/lru'

import $flows from './src/flows'
import $plugin from './src/plugin'

// TODO cache
function Parser() {
  this.lru = new LRU()
  this.parse = raw => {
    const ast = $flows.parse(raw, {
      cache: this.lru,
    })
    const noNewLineAST = ast.filter(x => x.type !== 'new-line')
    const htmlCode = $flows.traverse(noNewLineAST)
    return htmlCode
  }
}

Parser.prototype.use = function use({ on }) {
  on && $plugin.on(on)
}

export default Parser
