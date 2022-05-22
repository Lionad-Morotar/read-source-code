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

const tagNameRegex = '[a-zA-Z_][-.0-9_a-zA-Z]*'
const startTagOpenRegex = new RegExp('^<(' + tagNameRegex + ')')
const startTagCloseRegex = /^\s*(\/?)>/
const endTagRegex = new RegExp('^<\\/(' + tagNameRegex + ')>')
const attributeRegex = /^\s*([^\s"'<>\/=]+)\s*=\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))?/
const commentRegex = /^<!--/

// const isPlainTextElement = utils.makeMapFn('script,style,textarea'.split(','))

function parseHTML (html) {
  const stack = []
  let root = []
  const getLast = () => stack[stack.length - 1]
  // const isLastPlainTextTag = () => getLast() && isPlainTextElement(getLast().data.tagName)

  while (html) {
    const textEnd = html.indexOf("<")
    if (textEnd === 0) {

      // FIXME unfinished comment will fall into dead loop
      const commentMatch = matchComment()
      if (commentMatch) {
        handleComment()
      }

      const startTagMatch = matchStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
        continue
      }
      
      const endTagMatch = matchEndTag()
      if (endTagMatch) {
        handleEndTag(endTagMatch)
      }
    }
    else if (textEnd > 0) {
      let text = ''
      let nextEnd
      while (
        !endTagRegex.test(html) &&
        !startTagOpenRegex.test(html) &&
        !commentRegex.test(html)
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
          text
        }
        handleText(nodeData)
      }
    }
    else {
      break
    }
  } 

  function advance (len) {
    html = html.slice(len)
  }

  function matchStartTag () {
    const start = html.match(startTagOpenRegex)
    if (start) {
      const attrs = {}
      const nodeData = {
        tagName: start[1]
      }
      advance(start[0].length)
      let attr
      let hasAttr = false
      while (attr = html.match(attributeRegex)) {
        const [all, name, val] = attr
        advance(all.length)
        attrs[name] = val
        hasAttr = true
      }
      if (hasAttr) {
        nodeData.attrs = attrs
      }
      const end = html.match(startTagCloseRegex)
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

  function matchComment () {
    return commentRegex.test(html)
  }

  function handleComment () {
    const commentEnd = html.indexOf('-->')
    if (commentEnd > 0) {
      const text = html.slice(4, commentEnd)
      advance(commentEnd + 3)
      handleText({
        tagName: 'text',
        text,
        isComment: true
      })
    }
  }

  function handleText (nodeData) {
    const node = new Node({
      ...nodeData,
      text: parserConfig.filterEmpty
        ? nodeData.text.trim()
        : nodeData.text
    })
    if (parserConfig.filterEmpty) {
      if (nodeData.text.replace(/\s/g, '').length == 0) {
        return
      }
    }
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

  function matchEndTag () {
    return html.match(endTagRegex)
  }

  function handleEndTag (endTagMatch) {
    const [all, tagName] = endTagMatch
    const last = getLast()
    if (last) {
      if (!tagName === last.data.tagName) {
        throw new Error('[HTML Parser] end tag mismatch')
      }
      stack.pop()
      advance(all.length)
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
  <div test="test1"></div>
  <!-- hello comment -->
  <div test="test2"></div>
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
