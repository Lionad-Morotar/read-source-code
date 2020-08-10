Function.prototype.bind = function bind(context = globalThis) {
  const fn = this
  context.fn = fn

  return (...args) => {
    const res = context.fn(...args)
    delete context.fn
    return res
  }
}

const a = {
  name: 'a',
  say(lastName) {
    console.log(this.name + ' ' + lastName)
  },
}
const c = {
  name: 'c',
}

a.say.bind(c)('haha')
