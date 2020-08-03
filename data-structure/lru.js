import Node from './node.js'

/**
 * LRU 链表实现
 * @todo 内存限制
 */

/** Constructor */

const WEIGHT = 'weight'
const VAL = 'val'

function LRU(opts = {}) {
  this.opts = Object.assign(opts, { limit: 999 })
  this.headNode = new Node({ key: '__head__', data: { [VAL]: null, [WEIGHT]: Number.MAX_VALUE } })
  this.tailNode = new Node({ key: '__tail__', data: { [VAL]: null, [WEIGHT]: Number.MIN_VALUE } })
  this.headNode.linkNext(this.tailNode)
  this.nodeMemo = {}
  this.nodeLength = 0
  this.nodeLengthLimit = opts.limit
}

/** LRU prototype */

LRU.prototype.has = function (key) {
  return !!this.nodeMemo[key]
}

LRU.prototype.get = function (key) {
  const handle = this.nodeMemo[key]
  if (handle) {
    this.addNodeWeight(handle)
    return handle.data.val
  } else {
    throw new Error(`Key : ${key} is not fount in LRU Nodes`)
  }
}

LRU.prototype.getNodeWeight = function (key) {
  const handle = this.nodeMemo[key]
  if (handle) {
    return handle.get(WEIGHT)
  } else {
    throw new Error(`Key : ${key} is not fount in LRU Nodes`)
  }
}

// 添加新的缓存元素
LRU.prototype.set = function (key, val) {
  const handleNode = this.nodeMemo[key]
  if (handleNode) {
    this.addNodeWeight(handleNode, 10)
    handleNode.set(VAL, val)
  } else {
    if (this.nodeLength < this.nodeLengthLimit) {
      this.nodeLength++
    } else {
      const deleteNode = this.tailNode.prev
      deleteNode.unLink()
      delete this.nodeMemo[deleteNode.key]
    }
    const newNode = new Node({ key, data: { [VAL]: val, [WEIGHT]: 1 } })
    this.nodeMemo[key] = newNode
    newNode.insertAfter(this.tailNode.prev)
  }
}

// 打印缓存中全部节点
LRU.prototype.showAllNodes = function () {
  let next = this.headNode.next
  while (next && next.next) {
    console.log(`Node : ${next.key} has data ${next.get(VAL)} and weight ${next.get(WEIGHT)}`)
    next = next.next
  }
}

// 对某一元素进行加权操作
LRU.prototype.addNodeWeight = function (node, w = 1) {
  let prev = node.prev

  node.unLink()
  node.set(WEIGHT, node.get(WEIGHT) + w)
  while (prev) {
    if (prev.get(WEIGHT) <= node.get(WEIGHT)) {
      prev = prev.prev
    } else {
      node.insertAfter(prev)
      prev = null
    }
  }
}

export default LRU
