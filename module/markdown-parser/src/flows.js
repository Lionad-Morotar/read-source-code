import $state from './state'
import $matcher from './matcher'
import $compile from './compile'
import $plugin from './plugin'

/**
 * 将 Markdown 代码转为 AST
 * @todo huge task slice
 */
function parse(input, parent) {
  if (typeof input === 'string') {
    input = {
      type: null,
      flow: input,
      length: input.length,
    }
  }
  const state = $state.create(input.flow)

  // console.log(input)

  function flat(holds) {
    const flowsMatchers = $matcher.create(input.type, state.get('rest'))
    let i = -1
    while (++i < flowsMatchers.length) {
      const { type: matcherType, matcher } = flowsMatchers[i]
      const result = matcher(state.get('rest'), input, parent)
      const matched = result.flow
      // console.log(matcherType, result)
      if (matched) {
        const { type, flow, length, offset } = result
        // console.log(matcherType, state.get('rest'), offset, length)
        state.set('rest', state.get('rest').slice(offset || length))
        state.set('idx', state.get('idx') + (offset || length))
        type !== 'UNMATCH' && holds.push(result)
        break
      }
    }
  }

  let maxCount = input.length
  const holds = []
  const unstop = () => state.get('idx') < state.get('raw').length
  while (unstop()) {
    flat(holds)
    if (--maxCount < 0) {
      throw new Error('[ERR] Dead While')
    }
  }
  return holds.map(hold => {
    hold.children = hold.children ? hold.children.map(child => parse(child, parent)[0]) : parse(hold, parent)
    return hold
  })
}

/**
 * 从 Markdown AST 生成 HTML 代码
 */
function traverse(ast) {
  console.table(ast)
  const codes = ast.map(node => $compile.parse(node))
  const htmlCode = codes.join('\n')
  return $plugin.buildEnd(htmlCode)
}

export default {
  parse,
  traverse,
}
