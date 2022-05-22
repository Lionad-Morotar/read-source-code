/** Node Constructor */

const getRandID = () => `${+new Date()}_${String(Math.random()).slice(-6)}`

/**
 * Double Linked List Node
 */
function Node(config) {
  if (config && config.data) {
    this.key = config.key || getRandID()
    this.data = config.data || null
  } else {
    this.key = getRandID()
    this.data = config
  }
  this.prev = null
  this.next = null
}

/** Node prototype */

Node.prototype[Symbol.toStringTag] = 'double-linked-list-node'

// 获取节点数据
Node.prototype.get = function (prop) {
  return (this.data && this.data[prop]) || null
}

// 设置节点数据
Node.prototype.set = function (prop, value) {
  if (value) {
    this.data = this.data || {}
    this.data[prop] = value
    return this.data[prop]
  } else {
    this.data = prop
    return this.data
  }
}

// 将当前节点的next指向另一节点
Node.prototype.linkNext = function (nextNode) {
  this.next = nextNode
  nextNode.prev = this
}
Node.prototype.addNexts = function (nextNode) {
  this.next = this.next ? [...this.next, nextNode] : [nextNode]
  nextNode.prev = nextNode.prev ? [...nextNode.prev, this] : [this]
}

Node.prototype.linkPrev = function (prevNode) {
  prevNode.linkNext(this)
}
Node.prototype.addPrevs = function (prevNode) {
  prevNode.addNexts(this)
}

// 将某节点之后插入当前节点
Node.prototype.insertAfter = function (targetNode) {
  const targetNextNode = targetNode.next
  targetNode.linkNext(this)
  targetNextNode && this.linkNext(targetNextNode)
}
// TODO addAfter

Node.prototype.insertBefore = function (targetNode) {
  const targetPrevNode = targetNode.prev
  targetPrevNode && targetPrevNode.linkNext(this)
  this.linkNext(targetNode)
}
// TODO addBefore

// 节点脱链
Node.prototype.unLink = function () {
  const prev = this.prev
  const next = this.next
  const isSingleLinkNode = (prev instanceof Node) || (next instanceof Node)

  if (isSingleLinkNode) {
    if (prev && next) {
      prev.linkNext(next)
    }
    else if (prev) {
      prev.next = null
    }
    else if (next) {
      next.prev = null
    }
  } else {
    let idx
    if (prev && next) {
      idx = prev.next.findIndex(this)
      prev.next.splice(0, idx, 1)
      idx = next.prev.findIndex(this)
      next.prev.splice(0, idx, 1)
      prev.addNexts(next)
    }
    else if (prev) {
      idx = prev.next.findIndex(this)
      prev.next.splice(0, idx, 1)
    }
    else if (next) {
      idx = next.prev.findIndex(this)
      next.prev.splice(0, idx, 1)
    }
  }
}

export default Node
