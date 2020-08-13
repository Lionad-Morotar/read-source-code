function Stack() {
  this.stack = []
}

Stack.fn = Stack.prototype

Stack.fn.push = function push(item) {
  this.stack.push(item)
}

Stack.fn.pop = function pop() {
  this.stack.pop()
}

Stack.fn.peek = function peek() {
  return this.stack[this.stack.length - 1]
}

Stack.fn.getLength = function getLength(item) {
  return this.stack.length
}

Stack.fn.isEmpty = function isEmpty(item) {
  return this.stack.length === 0
}
