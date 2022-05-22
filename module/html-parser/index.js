/**
 * HTML Tokenizer
 * mostly a copy from vue.js
 */
import utils from '../../utils/index.js'
import chars from '../../utils/char.js'
import Node from '../../data-structure/node'

const tagName = '[a-zA-Z_][-.0-9_a-zA-Z]*'
const startTagOpen = new RegExp('^<(' + tagName + ')')
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp('^<\\/(' + tagName + ')>')
const attribute = /^\s*([^\s"'<>\/=]+)\s*=\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))?/

const isPlainTextElement = utils.makeMapFn('script,style,textarea'.split(','))

function parseHTML (html) {
  const stack = []
  let count = 0
  let root = new Node()
  while (html && (count ++ < 20)) {
    const textEnd = html.indexOf("<")
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      startTagMatch && handleStartTag(startTagMatch)
    }
  }

  function advance (len) {
    html = html.slice(len)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: {}
      }
      advance(start[0].length)
      let attr
      while (attr = html.match(attribute)) {
        const [all, name, val] = attr
        advance(all.length)
        match.attrs[name] = val
      }
      const end = html.match(startTagClose)
      if (end) {
        const [all, unarySlash] = end
        match.isUnary = unarySlash
        advance(all.length)
      }
      return match
    }
  }

  function handleStartTag (match) {
    // if (!match.isUnary) {
    //   stack.push(match)
    // }
  }

  return {
    stack
  }
}

const testHTML = `<div class="hello" id="world">
  plain text < plain text
  <input />
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

console.log(
  parseHTML(testHTML)
  .stack
)
