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

/**
 * HTML Parser
 * build from scratch
 * @param {String} html source of html
 * @param {Record<String,Fns>} parseHooks hook fn for some node type: comment, text
 * @todo more parseHooks options
 * @returns root of the ast, which is an array
 */
export default function parseHTML (html, parseHooks = {}) {
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
        const node = handleText({ text })
        if (node && node.data && !node.data.isComment) {
          parseHooks.text && parseHooks.text(node)
        }
      }
    }
    else {
      const node = handleText({ text: html })
      node && parseHooks.text && parseHooks.text(node)
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
    if (nodeData.isUnary) {
      parseHooks.end && parseHooks.end(node)
    } else {
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
      const nodeData = {
        text,
        isComment: true
      }
      const node = handleText(nodeData)
      parseHooks.comment && parseHooks.comment(node)
    }
  }

  function handleText (nodeData) {
    const node = new Node({
      ...nodeData,
      tagName: 'text',
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
    return node
  }

  function matchEndTag () {
    return html.match(endTagRegex)
  }

  function handleEndTag (nodeData) {
    const [all, tagName] = nodeData
    const last = getLast()
    if (last) {
      if (!tagName === last.data.tagName) {
        throw new Error('[HTML Parser] end tag mismatch')
      }
      const lastNode = stack.pop()
      advance(all.length)
      parseHooks.end && parseHooks.end(lastNode)
    }
  }

  return {
    root
  }
}

