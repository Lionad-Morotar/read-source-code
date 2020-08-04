const tasks = {
  buildEnd: {},
}
const dataStore = {}

function buildEnd(s) {
  console.log(tasks.buildEnd)
  console.log(dataStore)
  Object.keys(tasks.buildEnd).map(k => {
    const task = tasks.buildEnd[k]
    s = task.reduce((h, c) => {
      h = c(h)
      return h
    }, s)
  })
  return s
}

export default {
  buildEnd,
  tasks,
  dataStore,
}
