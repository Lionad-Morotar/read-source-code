export function makeMap(s) {
  const store = s.split(',').reduce((h, c) => ((h[c] = true), h), {})
  return x => store[x]
}

export function warn(str) {
  console.warn(`[WARN REACT] ${str}`)
}

export function log(str) {
  console.log(`[INFO REACT] ${str}`)
  // const rawConLog = console.log
  // console.log = (...args) => {
  //   const $seg = document.getElementById('log')
  //   const $text = document.createElement('div')
  //   $text.innerHTML = JSON.stringify(args)
  //   $seg.appendChild($text)
  //   rawConLog(...args)
  // }
}