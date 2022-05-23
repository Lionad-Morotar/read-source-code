function markStatic (node) {
  const { tagName, expression } = node.data
  if (tagName === 'text' && expression.match(/_s([^\)]*)/)) {
    node.data.isStatic = false
  } else {
    node.data.isStatic = true
  }
  if (node.next) {
    node.next.forEach(markStatic)
    const hasDynamicChild = node.next.find(x => !x.data.isStatic)
    if (hasDynamicChild) {
      node.data.isStatic = false
    }
  }
}

function markStaticRoot (node) {
  if (node.data.isStatic) {
    node.data.isStaticRoot = true
    return
  }
  if (node.next) {
    node.next.forEach(markStaticRoot)
  }
}

export default function optimizer (ast) {
  const root = ast.root
  root.map(markStatic) 
  root.map(markStaticRoot)
  console.log(root)
  return ast
}