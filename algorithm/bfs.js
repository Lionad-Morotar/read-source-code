function bfs(node) {
  const nodes = []
  const unhandle = [node]
  while (unhandle.length) {
    const curNode = unhandle.shift()
    if (curNode instanceof Array) {
      curNode.map(c => {
        unhandle.push(c)
      })
    } else {
      nodes.push(curNode)
    }
  }
  return nodes
}

console.log(bfs([0, [1, 2, [4, 5]], 6, [7, 8]]))
