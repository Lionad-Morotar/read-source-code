function CQueue(len) {
  if (len < 1) throw new Error('Length must greater than 1')
  this.queue = new Array(len)
  this.head = 0
  this.tail = 0
  this.size = 0
}

CQueue.fn = CQueue.prototype

CQueue.fn.enqueue = function enqueue(item) {
  if (this.head === (this.tail + 1) % this.queue.length) {
    this.resize(this.queue.length * 2)
  }
  this.queue[this.tail] = item
  this.size++
  this.tail = (this.tail + 1) % this.queue.length
}

CQueue.fn.dequeue = function dequeue() {
  if (!this.isEmpty()) {
    const item = this.queue[this.head]
    this.queue[this.head] = null
    this.size--
    this.head = (this.head + 1) % this.queue.length
    // 缩小队列，节约空间开销
    const threshold = Math.floor(this.queue.length * 0.3)
    if (this.size < threshold) {
      this.resize(threshold)
    }
    return item
  } else {
    throw new Error('Queue is empty already')
  }
}

CQueue.fn.getFront = function getFront() {
  if (!this.isEmpty()) {
    return this.queue[this.head]
  } else {
    throw new Error('Queue is empty already')
  }
}

CQueue.fn.getLength = function getLength() {
  return this.queue.length
}

CQueue.fn.isEmpty = function isEmpty() {
  // or this.head === this.tail
  return this.size === 0
}

CQueue.fn.resize = function resize(newLen) {
  const q = new Array(newLen)
  let qLength = this.queue.length
  let i = -1
  while (++i < this.size) {
    q[i] = this.queue[(i + this.head) % qLength]
  }
  this.queue = q
  this.head = 0
  this.tail = this.size
}

/** for test */

const q = new CQueue(2)
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
q.enqueue(4)
q.enqueue(5)
q.enqueue(6)
q.enqueue(7)
q.enqueue(8)
q.dequeue()
q.dequeue()
q.dequeue()
q.dequeue()
q.dequeue()
console.log(q)

// CQueue {
//   queue: [ 6, 7, 8, <1 empty item> ],
//   head: 0,
//   tail: 3,
//   size: 3
// }
