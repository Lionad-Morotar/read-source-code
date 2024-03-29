import Dep from './dep'
import extendProto, { extendedProto } from './array'
import { define, noop } from '../utils'

export class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    define(value, '__ob__', this)
    this.extendArrayProto()
    this.walkReactive()
  }
  extendArrayProto () {
    Array.isArray(this.value) && extendProto(this.value)
  }
  walkReactive () {
    const value = this.value
    Array.isArray(value)
    ? value.map(observe)
    : value instanceof Object
    ? Object.entries(value).map(([k, v]) => defineReactive(value, k, v))
    : noop
  }
}

export function observe (value) {
  if ((value instanceof Object) || Array.isArray(value)) {
    return value.__ob__ || new Observer(value)
  } else {
    return null
  }
}

export function defineReactive(obj, k, v) {
  const dep = new Dep()
  let childObserver = observe(v)
  Object.defineProperty(obj, k, {
    enumerable: true,
    configurable: true,
    get () {
      dep.depend()
      if (childObserver) {
        childObserver.dep.depend()
        Array.isArray(v) && dependArray(v)
      }
      return v
    },
    set (nv) {
      if (v === nv) return
      v = nv
      childObserver = observe(nv)
      dep.notify()
    }
  })
}

function dependArray (value) {
  value.map(x => {
    x && x.__ob__ && x.__ob__.dep.depend()
    Array.isArray(x) && dependArray(x)
  })
}
