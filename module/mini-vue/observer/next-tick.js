const queue = []

let task = null

export default function nextTick (fn) {
  queue.push(fn)
  if (!task) {
    task = Promise.resolve().then(runTasks)
  }
}

function runTasks () {
  const copy = queue.slice()
  queue.length = 0
  copy.map(fn => fn())
  task = null
}
