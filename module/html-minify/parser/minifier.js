const PostCSS = require('postcss')

// 克隆节点
function cloneNode(node) {
  return {
    tag: node.tag,
    attrsList: node.attrsList,
    attrsMap: node.attrsMap,
    text: node.text,
    children: []
  }
}

// 遍历 AST，并初步处理节点
function extractFrom(ast, applys) {
  const tags = applys.tags

  function dfs(node) {
    const newNode = cloneNode(node)

    const tagMatched = tags[node.tag]
    if (tagMatched) {
      return tagMatched(node)
    }

    if (node.children && node.children.length) {
      newNode.children = node.children.map(x => dfs(x)).filter(Boolean)
    }
    return newNode
  }

  return dfs(ast)
}

// 处理 HTML
module.exports = function minifier(ast) {
  let style = ''
  const root = extractFrom(ast, {
    tags: {
      script: _ => null,
      style: node => style += (node.children || [])[0].text
    }
  })

  const cssnodes = PostCSS.parse(style).nodes

  cssnodes.map(rule => {
    console.log(rule.selector)
  })
}