import LRU from '../../data-structure/lru'

import $flows from './src/flows'
import $plugin from './src/plugin'

// TODO cache
function Parser() {
  this.lru = new LRU()
  this.parse = async raw => {
    $plugin.emit('buildStart')
    const ast = await $flows.parse(raw, {
      cache: this.lru,
    })
    const noWrapLineAST = ast.filter(x => x.type !== 'new-line')
    const htmlCode = await $flows.stringify(noWrapLineAST)
    return htmlCode
  }
}

Parser.prototype.on = $plugin.on

export default Parser
