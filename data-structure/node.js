/** Node Constructor */

function Node(config) {
  this.key = config.key || String(Math.random()).slice(-5)
  this.prev = null
  this.next = null
  this.data = config.data || null
}

/** Node prototype */

// 获取节点数据
Node.prototype.get = function (prop) {
  return (this.data && this.data[prop]) || null
}

// 设置节点数据
Node.prototype.set = function (prop, value) {
  this.data = this.data || {}
  this.data[prop] = value
  return this.get(prop)
}

// 将当前节点的next指向另一节点 linkNextTo
Node.prototype.linkNext = function (nextNode) {
  this.next = nextNode
  nextNode.prev = this
}

Node.prototype.linkPrev = function (prevNode) {
  prevNode.linkNext(this)
}

// 将某节点之后插入当前节点
Node.prototype.insertAfter = function (prevNode) {
  const prevNextNode = prevNode.next
  prevNode.linkNext(this)
  this.linkNext(prevNextNode)
}

// 节点脱链
Node.prototype.unLink = function () {
  const prev = this.prev
  const next = this.next

  if (!prev || !next) {
    // 头节点和尾节点不能 unlink
    return false
  }
  prev.linkNext(next)
}

export default Node
