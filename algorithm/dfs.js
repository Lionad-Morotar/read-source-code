function dfs(node, nodes = []) {
  if (node instanceof Array) {
    node.map(n => dfs(n, nodes))
  } else {
    nodes.push(node)
  }
  return nodes
}

console.log(dfs([0, [1, [2, 3], [4, 5]], 6, [7, 8]]))
