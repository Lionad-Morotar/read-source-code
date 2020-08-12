const tasks = {
  buildEnd: {},
}
const dataStore = {}

function buildEnd(s) {
  // console.log(tasks.buildEnd)
  // console.log(dataStore)
  Object.keys(tasks.buildEnd).map(k => {
    const task = tasks.buildEnd[k]
    if (task instanceof Array) {
      s = task.reduce((h, c) => {
        h = c(h)
        return h
      }, s)
    } else {
      s = task(s)
    }
  })
  return s
}

/** Plugins */

const addTaskCache = {}
function addTask(event) {
  const task = tasks[event]
  const res =
    addTaskCache[event] ||
    (addTaskCache[event] = function (...args) {
      let name, cb
      if (args.length > 1) {
        ;[name, cb] = args
      } else {
        const arg = args[0]
        if (arg instanceof Function) {
          name = 'AnonymousTask-' + String(Math.random()).slice(-6)
          cb = arg
        } else if (arg instanceof Object) {
          name = arg.name
          cb = arg.cb
        }
      }
      task[name] = cb
    })

  return res
}

function addData() {}

function on(plugins) {
  Object.keys(plugins).map(event => {
    const plugin = plugins[event]
    const task = tasks[event]
    if (event) {
      plugin({ addTask: addTask(event) })
    }
  })
}

export default {
  on,
  buildEnd,
  tasks,
  dataStore,
}
