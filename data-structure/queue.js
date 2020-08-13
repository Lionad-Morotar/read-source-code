function Queue() {
  this.queue = []
}

Queue.fn = Queue.prototype

Queue.fn.enqueue = function enqueue(item) {
  this.queue.push(item)
}

Queue.fn.dequeue = function dequeue() {
  return this.queue.shift()
}

Queue.fn.getFront = function getFront() {
  return this.queue[0]
}

Queue.fn.getLength = function getLength() {
  return this.queue.length
}

Queue.fn.isEmpty = function isEmpty() {
  return this.queue.length === 0
}
