import $char from './char'

// TODO matcher result uniform
// TODO token

const flag = {
  inline: 'INLINE-PLACEHOLDER',
}

const defaultMatchers = [
  /******************************************************************************* Single Char */
  {
    type: 'new-line',
    matcher(str) {
      const isNewLine = $char.isNewLine(str[0])
      return {
        type: 'new-line',
        flow: isNewLine ? str[0] : null,
        length: isNewLine ? 1 : 0,
      }
    },
  },
  /******************************************************************************* Line Start - Multy Line */
  {
    type: 'unorder-list',
    matcher(str) {
      const result = { type: 'unorder-list', flow: null, length: 0 }
      const flag = ['*', '-', '+']
      if (flag.includes(str[0])) {
        let i = -1
        while (++i < flag.length) {
          const tryFlag = flag[i]
          // TODO cache
          const regexMain = new RegExp(
            `^((${'\\' + tryFlag}\\s+[^\\n]*\\n(?=${'\\' + tryFlag}))|(${'\\' + tryFlag}\\s+[^\\n]*))+`
          )
          const regexChildren = new RegExp(`${'\\' + tryFlag}\\s+[^\\n]*`, 'g')
          const regexChildrenText = new RegExp(`${'\\' + tryFlag}\\s+([^\\n]*)`)
          const match = str.match(regexMain)
          if (match && match[0]) {
            result.flow = match[0]
            result.length = match[0].length
            result.children = match[0].match(regexChildren).map(x => x.match(regexChildrenText)[1])
            break
          }
        }
      }
      return result
    },
  },
  {
    type: 'order-list',
    matcher(str) {
      const result = { type: 'order-list', flow: null, length: 0 }
      const startNum = $char.readNum(str)
      if (startNum.value) {
        const match = str.match(/^(((\d+\.)\s+[^\n]*\n(?=(\d+\.)))|((\d+\.)\s+[^\n]*))+/)
        if (match && match[0]) {
          result.flow = match[0]
          result.length = match[0].length
          result.children = match[0].match(/(\d+\.)\s+[^\n]*/g).map(x => x.match(/(\d+\.)\s+([^\n]*)/)[2])
        }
      }
      return result
    },
  },
  {
    type: 'blockquote',
    matcher(str) {
      const result = { type: 'blockquote', flow: null, length: 0 }
      if (str[0] === '>') {
        const match = str.match(/^((\>\s+[^\n]*\n(?=\>))|(\>\s+[^\n]*))+/)
        if (match && match[0]) {
          result.flow = match[0]
          result.length = match[0].length
          result.children = match[0].match(/\>\s+[^\n]*/g).map(x => x.match(/\>\s+([^\n]*)/)[1])
        }
      }
      return result
    },
  },
  {
    type: 'codeblock',
    matcher(str) {
      const result = { type: 'codeblock', flow: null, length: 0 }
      if (str[0] === '`') {
        const match = str.match(/^\`\`\`([^\s\n]+)(\n|\s)([^\`]*)\`\`\`/)
        if (match && match[0]) {
          result.flow = match[0]
          result.length = match[0].length
          result.children = []
          result.data = {
            language: match[1],
            code: match[3],
          }
        }
      }
      return result
    },
  },
  /******************************************************************************* Line Start */
  {
    type: 'hr',
    matcher(str) {
      const result = { type: 'hr', flow: null, length: 0 }
      if (str[0] === '-') {
        const match = str.match(/^(---)\n|$/)
        if (match && match[1]) {
          result.flow = '---'
          result.length = 3
          result.children = []
        }
      }
      return result
    },
  },
  {
    type: 'header',
    matcher(str) {
      const result = { type: 'header', flow: null, length: 0 }
      if (str[0] === '#') {
        const match = str.match(/^(#+)\s+([^\n]*)/)
        if (match && match[0]) {
          result.flow = match[0]
          result.length = match[0].length
          result.children = []
          result.data = {
            level: match[1].length,
            title: match[2],
          }
        }
      }
      return result
    },
  },
  {
    type: 'image',
    matcher(str) {
      const result = { type: 'image', flow: null, length: 0 }
      if (str[0] === '!') {
        const match = str.match(/^(!\[([^\]]*)\]\(([^\)]*)\))/)
        if (match && match[1]) {
          result.flow = match[1]
          result.length = match[1].length
          result.children = []
          result.data = {
            alt: match[2],
            src: match[3],
          }
        }
      }
      return result
    },
  },
  /******************************************************************************* Inline */
  {
    type: 'text',
    matcher(str) {
      const result = { type: 'text', flow: null, length: 0 }
      const match = str.match(/[^\n]*/)
      if (match && match[0]) {
        result.flow = match[0]
        result.length = match[0].length
      }
      return result
    },
  },
  {
    type: 'code',
    priority(str) {
      const match = str.match(/\`([^\`\s][^\`\`]*[^\`\s])\`/)
      return match ? match.index : Number.MAX_SAFE_INTEGER
    },
    matcher(str) {
      const result = { type: 'code', flow: null, length: 0 }
      const match = str.match(/\`([^\`\s][^\`\`]*[^\`\s])\`/)
      if (match && match[0]) {
        result.flow = match[0]
        result.length = match[0].length
        result.offset = match.index + match[0].length
        result.data = {
          text: match[1],
        }
      }
      return result
    },
  },
  {
    type: 'delete',
    priority(str) {
      const match = str.match(/~~([^~\s][^~]*[^~\s])~~/)
      return match ? match.index : Number.MAX_SAFE_INTEGER
    },
    matcher(str) {
      const result = { type: 'delete', flow: null, length: 0 }
      const match = str.match(/~~([^~\s][^~]*[^~\s])~~/)
      if (match && match[0]) {
        result.flow = match[0]
        result.length = match[0].length
        result.offset = match.index + match[0].length
        result.data = {
          text: match[1],
        }
      }
      return result
    },
  },
  {
    type: 'bold',
    priority(str) {
      const match = str.match(/\*\*([^\*\s][^\*]*[^\*\s])\*\*/)
      return match ? match.index : Number.MAX_SAFE_INTEGER
    },
    matcher(str) {
      const result = { type: 'bold', flow: null, length: 0 }
      const match = str.match(/\*\*([^\*\s][^\*]*[^\*\s])\*\*/)
      if (match && match[0]) {
        result.flow = match[0]
        result.length = match[0].length
        result.offset = match.index + match[0].length
        result.data = {
          text: match[1],
        }
      }
      return result
    },
  },
  {
    type: 'italic',
    priority(str) {
      const match = str.match(/\*([^\*\s][^\*]*[^\*\s])\*/)
      return match ? match.index : Number.MAX_SAFE_INTEGER
    },
    matcher(str) {
      const result = { type: 'italic', flow: null, length: 0 }
      const match = str.match(/\*([^\*\s][^\*]*[^\*\s])\*/)
      if (match && match[0]) {
        result.flow = match[0]
        result.length = match[0].length
        result.offset = match.index + match[0].length
        result.data = {
          text: match[1],
        }
      }
      return result
    },
  },
  {
    type: 'link',
    priority(str) {
      const match = str.match(/\[([^\]]*)\]\(([^\)]*)\)/)
      return match ? match.index : Number.MAX_SAFE_INTEGER
    },
    matcher(str) {
      const result = { type: 'link', flow: null, length: 0 }
      const match = str.match(/\[([^\]]*)\]\(([^\)]*)\)/)
      if (match && match[0]) {
        result.flow = match[0]
        result.length = match[0].length
        result.offset = match.index + match[0].length
        result.data = {
          text: match[1],
          href: match[2],
        }
      }
      return result
    },
  },
  /******************************************************************************* UNMATCH */
  {
    type: 'UNMATCH',
    matcher(str) {
      return {
        type: 'UNMATCH',
        flow: str,
        length: str.length,
      }
    },
  },
]

/** 将源代码按照行划分，方便调试 */
const useLineMatcher = false
if (useLineMatcher) {
  defaultMatchers.unshift({
    type: 'line',
    matcher(str) {
      const result = { type: 'line', flow: null, length: 0 }
      const match = str.match(/([^\n]*(\n|$))/)
      if (match && match[1]) {
        result.flow = match[1]
        result.length = match[1].length
      }
      return result
    },
  })
}

function resortByType(matchers, type, rest) {
  if (type === 'text') {
    const matchersPriority = matchers.map(m =>
      m.hasOwnProperty('priority') ? m.priority(rest) : Number.MAX_SAFE_INTEGER
    )
    return matchers.sort((a, b) => {
      const idxa = matchers.findIndex(x => x === a)
      const idxb = matchers.findIndex(x => x === b)
      return matchersPriority[idxa] - matchersPriority[idxb]
    })
  } else {
    return matchers
  }
}

const create = (type = null, rest) => {
  const unreplacedMatchers = [...defaultMatchers]
  const matchers = unreplacedMatchers.filter(x => typeof x === 'object')
  const typeIdx = matchers.findIndex(x => x.type === type)
  const sliceStartIdx = typeIdx + 1
  const sliceEndIdx = matchers.length
  return resortByType(matchers.slice(sliceStartIdx, sliceEndIdx), type, rest)
}

export default { create }
