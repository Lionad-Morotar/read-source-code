const queue = []
const memo = {}

let task = null

export function queueWatcher (watcher) {
  if (memo[watcher.id]) {
    return null
  }
  memo[watcher.id] = true
  queue.push(watcher)

  if (!task) {
    task = Promise.resolve().then(runWatchers)
  }
}

function runWatchers () {
  queue.sort((a, b) => a.id - b.id)

  const copy = queue.slice()
  queue.length = 0

  copy.map(watcher => {
    watcher.run()
    delete memo[watcher.id]
  })
  cleanUp()
}

function cleanUp () {
  task = null
}
