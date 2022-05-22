/**
 * HTML Tokenizer
 * mostly a copy from vue.js
 */
import utils from '../../utils/index.js'
import chars from '../../utils/char.js'
import Node from '../../data-structure/node'

const parserConfig = {
  // is \r\n and spaces considered as a node
  filterEmpty: true,
  //// is text a single node or an attribute of the parent node
  //// compactTextNode: true
}

const tagName = '[a-zA-Z_][-.0-9_a-zA-Z]*'
const startTagOpen = new RegExp('^<(' + tagName + ')')
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp('^<\\/(' + tagName + ')>')
const attribute = /^\s*([^\s"'<>\/=]+)\s*=\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))?/

const isPlainTextElement = utils.makeMapFn('script,style,textarea'.split(','))

function parseHTML (html) {
  const stack = []
  let root = []
  const getLast = () => stack[stack.length - 1]
  const isLastPlainTextTag = () => getLast() && isPlainTextElement(getLast().data.tagName)

  while (html) {
    const textEnd = html.indexOf("<")
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      startTagMatch && handleStartTag(startTagMatch)
      
      parseEndTag()
    }
    else if (textEnd > 0) {
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
    else {
      break
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

  function handleStartTag (nodeData) {
    const node = new Node(nodeData)
    const last = getLast()
    if (last) {
      last.addNexts(node)
    } else {
      root.push(node)
    }
    if (!nodeData.isUnary) {
      stack.push(node)
    }
  }

  function handleText (nodeData) {
    const node = new Node(nodeData)
    const last = getLast()
    if (last) {
      if (parserConfig.compactTextNode) {
        last.data = {
          ...nodeData,
          ...last.data,
        }
      } else {
        last.addNexts(node)
      }
    } else {
      root.push(node)
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

  return {
    root
  }
}

const testHTML = 
`
  <div class="hello" id="world">
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
  <input class="input 3" />
  <style>
    .css { css: 'css' }
  </style>
  <div test="test"></div>
`



const root = parseHTML(testHTML).root
const wash = node => node instanceof Array
  ? node.map(wash)
  : node 
  ? (node.next || []).map(wash).length
    ? ({ data: node.data, next: (node.next || []).map(wash) })
    : ({ data: node.data })
  : null
const res = wash(root)
// console.log(root)
console.log(JSON.stringify(res, null, 2))
