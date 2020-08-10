Function.prototype.apply = function apply(context = globalThis, args = []) {
  const fn = this

  context.fn = fn
  const res = context.fn(...args)
  delete context.fn

  return res
}

const a = {
  name: 'a',
  say() {
    console.log(this.name)
  },
}
const c = {
  name: 'c',
}

a.say.apply(c)
