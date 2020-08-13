function Queue() {
  this.stack = []
}

Queue.fn = Queue.prototype

Queue.fn.enqueue = function enqueue(item) {
  this.stack.push(item)
}

Queue.fn.dequeue = function dequeue() {
  this.stack.shift()
}

Queue.fn.getFront = function getFront() {
  return this.stack[this.stack.length - 1]
}

Queue.fn.getLength = function getLength() {
  return this.stack.length
}

Queue.fn.isEmpty = function isEmpty() {
  return this.stack.length === 0
}
