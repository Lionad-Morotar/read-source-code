let uid = 0

export default class Dep {
  constructor () {
    this.id = ++uid
    this.subs = []
  }
  addSub (watcher) {
    !this.subs.includes(watcher) && this.subs.push(watcher)
  }
  removeSub (watcher) {
    const index = this.subs.indexOf(watcher)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }
  depend () {
    Dep.target && Dep.target.addDep(this)
  }
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null
const stack = []

export function pushTarget (watcher) {
  stack.push(watcher)
  Dep.target = watcher
}

export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
