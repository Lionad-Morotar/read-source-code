function markStatic (node) {
  const { tag, expression, children } = node
  // TODO refactor
  if (tag === 'text' && expression && expression.match(/_s([^\)]*)/)) {
    node.isStatic = false
  } else {
    node.isStatic = true
  }
  if (children && children.length) {
    node.children.forEach(markStatic)
    const hasDynamicChild = children.find(x => !x.isStatic)
    if (hasDynamicChild) {
      node.isStatic = false
    }
  }
}

function markStaticRoot (node) {
  if (node.isStatic) {
    node.isStaticRoot = true
    return
  }
  if (node.children && node.children.length) {
    node.children.forEach(markStaticRoot)
  }
}

export default function optimize (ast) {
  const root = ast.root
  root.map(markStatic) 
  root.map(markStaticRoot)
  return ast
}