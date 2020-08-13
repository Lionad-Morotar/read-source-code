import Node from './node.js'

function LinkList() {
  this.head = new Node({ key: '__head__' })
  this.tail = new Node({ key: '__tail__' })
  this.head.linkNext(this.tail)
  this.size = 0
}

LinkList.fn = LinkList.prototype

LinkList.fn.addNode = function addNode(data, index = this.size) {
  const node = new Node({ data })
  const p = this.getNodeByIdx(index)
  node.insertAfter(p)
  this.size++
}

LinkList.fn.delNode = function delNode(index = this.size) {
  const p = this.getNodeByIdx(index)
  p.unLink()
  this.size--
}

LinkList.fn.getNodeByIdx = function getNodeByIdx(index) {
  let p = this.head
  let i = index
  while (i-- > 0) {
    p = p.next
    if (!p.next) {
      throw new Error('out of bound')
    }
  }
  return p
}

const ll = new LinkList()
ll.addNode(1)
ll.delNode()
console.log(ll.size) // >>> 0

ll.addNode(1)
ll.addNode(2)
ll.addNode(3)
ll.delNode()
console.log(ll.size) // >>> 2
