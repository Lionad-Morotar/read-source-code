/**
 * @see HTML Parser @VueJS 
 * !Modified
**/

/* Helpers */
function makeMap(s) {
  const store = s.split(',').reduce((h, c) => ((h[c] = true), h), {})
  return x => store[x]
}
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/* 属性匹配 */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const reCache = {}

/* 标签匹配 */
const isPreTag = makeMap('pre')
const isPlainTextElement = makeMap('script,style,textarea')
const isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr')
const isIgnoreNewlineTag = makeMap('pre,textarea')
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'
const canBeLeftOpenTag = makeMap('link,meta,param,source,track,wbr')
const isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
)

/**
 * 主函数 HTML Parser
 * @param {String} html 源码
 * @param {Object} options 配置项
 */
module.exports = function parseHTML(html, options) {
  const stack = []
  let index = 0
  let last, lastTag

  options.start = options.start || (_ => _)
  options.end = options.end || (_ => _)
  options.chars = options.chars || (_ => _)

  while (html) {
    last = html

    /* 处理非文本内容 */
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<')

      if (textEnd === 0) {
        /* 去除注释 */
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->')
          if (commentEnd >= 0) {
            advance(commentEnd + 3)
            continue
          }
        }
        /* 去除条件注释 */
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>')
          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2)
            continue
          }
        }
        /* 去除文档声明 */
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          advance(doctypeMatch[0].length)
          continue
        }
        /* 处理标签尾 */
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          const curIndex = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIndex, index)
          continue
        }
        /* 处理标签头 */
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
          handleStartTag(startTagMatch)
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1)
          }
          continue
        }
      }

      /* 处理标签外部的文本 */
      let text, rest, next
      if (textEnd >= 0) {
        rest = html.slice(textEnd)
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          next = rest.indexOf('<', 1)
          if (next < 0) break
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
      }

      /* 不包含标签则全为文本 */
      if (textEnd < 0) {
        text = html
      }

      if (text) {
        advance(text.length)
      }
      if (options.chars && text) {
        options.chars(text, index - text.length, index)
      }

      /* 匹配完标签头后，开始处理标签内部内容 */
    } else {
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1)
        }
        options.chars(text)
        return ''
      })

      index += html.length - rest.length
      html = rest
      parseEndTag(stackedTag, index - endTagLength, index)
    }

    if (html === last) {
      options.chars(html)
      break
    }
  }

  // 清理剩余的标签内容
  parseEndTag()

  /* Functions */

  // 步进
  function advance(n) {
    index += n
    html = html.substring(n)
  }

  // 解析标签头及属性
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index,
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  // 将标签头信息转换成对象
  function handleStartTag(match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash

    if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
      parseEndTag(lastTag)
    }
    if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
      parseEndTag(tagName)
    }

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      attrs[i] = {
        name: args[1],
        value,
      }
    }

    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs
      })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  // 解析标签尾内容
  function parseEndTag(tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}
