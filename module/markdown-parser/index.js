import LRU from '../../data-structure/lru'

import $flows from './src/flows'

// TODO cache
function Parser() {
  const lru = new LRU()
  const parse = raw => {
    const ast = $flows.parse(raw, {
      cache: lru,
    })
    const noNewLineAST = ast.filter(x => x.type !== 'new-line')
    const htmlCode = $flows.traverse(noNewLineAST)
    return htmlCode
  }
  return { lru, parse }
}

export default Parser
