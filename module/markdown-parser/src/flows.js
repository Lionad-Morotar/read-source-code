import $state from './state'
import $matcher from './matcher'
import $compile from './compile'
import $plugin from './plugin'

import utils from '../../../utils'

/**
 * 将 Markdown 代码转为 AST
 */
function parse(input, parent) {
  return new Promise(async resolve => {
    input = normInput(input)
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

    /* 子任务切片 */
    const useAsyncParse = false
    const parseChild = async hold => {
      // parse child
      hold.children = hold.children
        ? await utils
            .forAwait(
              hold.children,
              async child => (await parse(child, parent))[0]
              // utils.nextFrameCB(async child => (await parse(child, parent))[0])
            )
            .then(datas => datas)
        : await parse(hold, parent)
      // emit
      $plugin.emit('progress', {
        type: 'parse',
        data: {
          type: hold.type,
          flow: hold.flow,
        },
      })
      return hold
    }
    utils
      .forAwait(holds, useAsyncParse ? utils.nextFrameCB(parseChild) : parseChild)
      .then(newHolds => resolve(newHolds))
  })
}
function normInput(input) {
  if (typeof input === 'string') {
    input = {
      type: null,
      flow: input,
      length: input.length,
    }
  }
  return input
}

/**
 * 从 Markdown AST 生成 HTML 代码
 */
async function stringify(ast) {
  console.table(ast)
  const codes = await traverse(
    ast,
    utils.nextFrameCB(async node => {
      const parsed = await $compile.parse(node)
      $plugin.emit('progress', {
        type: 'html',
        data: parsed,
      })
      return parsed
    })
  )
  const htmlCode = codes.join('\n')
  return $plugin.emit('buildEnd', htmlCode)
}
async function traverse(ast, cb) {
  return await utils.forAwait(ast, cb)
}

export default {
  parse,
  stringify,
}
