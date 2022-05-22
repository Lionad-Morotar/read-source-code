/**
 * HTML Tokenizer
 * mostly a copy from vue.js
 */
import utils from '../../utils/index.js'
import chars from '../../utils/char.js'
import Node from '../../data-structure/node'

const parserConfig = {
  filterEmpty: true
}

const tagName = '[a-zA-Z_][-.0-9_a-zA-Z]*'
const startTagOpen = new RegExp('^<(' + tagName + ')')
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp('^<\\/(' + tagName + ')>')
const attribute = /^\s*([^\s"'<>\/=]+)\s*=\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))?/

function parseHTML (html) {
  const stack = []
  let count = 0
  let root = null
  const getLast = () => stack[stack.length - 1]

  while (html && (count ++ < 20)) {
    const textEnd = html.indexOf("<")
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      startTagMatch && handleStartTag(startTagMatch)
      
      parseEndTag()
    }
    if (textEnd > 0) {
      let text = ''
      let nextEnd
      while (
        !endTag.test(html) &&
        !startTagOpen.test(html)
      ) {
        nextEnd = html.indexOf("<")
        if (nextEnd < 0) {
          break
        }
        if (nextEnd > 0) {
          text += html.slice(0, nextEnd)
          advance(nextEnd)
        }
        if (nextEnd === 0) {
          text += '<'
          advance(1)
        }
      }
      
      if (text) {
        const nodeData = {
          tagName: 'text',
          text: parserConfig.filterEmpty
            ? text.trim()
            : text
        }
        if (parserConfig.filterEmpty) {
          if (text.replace(/\s/g, '').length) {
            handleText(nodeData)
          }
        } else {
          handleText(nodeData)
        }
      }
    }
  } 

  function advance (len) {
    html = html.slice(len)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const attrs = {}
      const nodeData = {
        tagName: start[1]
      }
      advance(start[0].length)
      let attr
      let hasAttr = false
      while (attr = html.match(attribute)) {
        const [all, name, val] = attr
        advance(all.length)
        attrs[name] = val
        hasAttr = true
      }
      if (hasAttr) {
        nodeData.attrs = attrs
      }
      const end = html.match(startTagClose)
      if (end) {
        const [all, unarySlash] = end
        if (unarySlash) {
          nodeData.isUnary = true
        }
        advance(all.length)
      }
      return nodeData
    }
  }

  function parseEndTag () {
    const end = html.match(endTag)
    if (end) {
      const [all, tagName] = end
      const last = getLast()
      if (last) {
        if (!tagName === last.data.tagName) {
          throw new Error('[HTML Parser] end tag mismatch')
        }
        stack.pop()
        advance(all.length)
      }
    }
  }

  function handleStartTag (nodeData) {
    const node = new Node(nodeData)
    if (!root) {
      root = node
    }
    const last = getLast()
    if (last) {
      last.addNexts(node)
    }
    if (!nodeData.isUnary) {
      stack.push(node)
    }
  }

  function handleText (nodeData) {
    const node = new Node(nodeData)
    const last = getLast()
    if (last) {
      last.addNexts(node)
    }
  }

  return {
    root,
    stack
  }
}

const testHTML = `<div class="hello" id="world">
  <input class="input 1" />
  plain text < plain > text
  <input class="input 2" />
  <table>
    <thead>Hello</thead>
    <tbody>
      <tr>
        <td>Hello</td>
      </tr>
    </tbody>
  </table>
</div>
`

const root = parseHTML(testHTML).root
const wash = node => node ? ({ data: node.data, next: (node.next || []).map(wash) }) : null
const res = wash(root)
// console.log(root)
console.log(JSON.stringify(res, null, 2))
