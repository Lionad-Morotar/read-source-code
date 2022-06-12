import { define } from '../utils'

const proto = Array.prototype
export const extendedProto = Object.create(proto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methodsToPatch.map(method => {
  const raw = proto[method]
  define(extendedProto, method, function (...args) {
    const result = raw.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    inserted && ob.walkReactive(inserted)
    ob.dep.notify()
    return result
  }, true)
})

export default function extendProto (value) {
  Object.setPrototypeOf
  ? Object.setPrototypeOf(value, extendedProto)
  : value.__proto__
  ? define(value, '__proto__', extendedProto)
  : Object.assign(value, extendedProto)
}
