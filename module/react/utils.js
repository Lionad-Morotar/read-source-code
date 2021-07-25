export function makeMap(s) {
  const store = s.split(',').reduce((h, c) => ((h[c] = true), h), {})
  return x => store[x]
}

export function warn(str) {
  console.warn(`[WARN REACT] ${str}`)
}