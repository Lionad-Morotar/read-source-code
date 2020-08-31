const tasks = {
  progress: {},
  buildStart: {},
  buildEnd: {},
}
const dataStore = {}

// * for test
function check() {
  console.log(tasks)
  console.log(dataStore)
}

/** Plugins */

function addTask(event, ...args) {
  const task = tasks[event]
  let name, cb
  if (args.length > 1) {
    ;[name, cb] = args
  } else {
    const firstArg = args[0]
    if (firstArg instanceof Function) {
      name = 'AnonymousTask-' + String(Math.random()).slice(-6)
      cb = firstArg
    } else if (firstArg instanceof Object) {
      name = firstArg.name
      cb = firstArg.cb
    }
  }
  task[name] = cb
}

function addData() {}

function on(events) {
  Object.keys(events).map(event => {
    const plugin = events[event]
    addTask(event, plugin)
  })
}

function emit(eventType, s) {
  Object.keys(tasks[eventType]).map(k => {
    const task = tasks[eventType][k]
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

export default {
  on,
  emit,
  tasks,
  dataStore,
}
