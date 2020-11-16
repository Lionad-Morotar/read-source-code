const htmlParser = require('./html-parser')

/* Helpers */

// 生成 AST 节点
function createASTElement(tag, attrs = [], parent) {
  return {
    tag,
    attrsList: attrs,
    attrsMap: attrs.reduce((h, c) => {
      h[c.name] = c.value
      return h
    }, {}),
    parent,
    children: []
  }
}

// 将 HTML 源码解析为 AST
module.exports = function parse(template) {
  const stack = []
  let root = null
  let currentParent

  function closeElement(element) {
    if (currentParent) {
      currentParent.children.push(element)
      element.parent = currentParent
    }
  }

  htmlParser(
    template,
    {
      start(tag, attrs, unary) {
        // console.log('start : ', tag)
        const element = createASTElement(tag, attrs, currentParent)
        if (!root && !stack.length) {
          root = element
        }
        if (!unary) {
          currentParent = element
          stack.push(element)
        } else {
          closeElement(element)
        }
      },
      end() {
        // console.log('end : ', stack[stack.length - 1])
        const element = stack[stack.length - 1]
        stack.length -= 1
        currentParent = stack[stack.length - 1]
        closeElement(element);
      },
      chars(text) {
        // console.log('text: ', text)

        const lineBreakRE = /[\r|\n|\r\n]{1}/
        if (lineBreakRE.test(text)) return null

        if (text && currentParent) {
          currentParent.children.push({
            text
          })
        }
      }
    }
  )

  return root
}
