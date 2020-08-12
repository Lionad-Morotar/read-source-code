function makeMap(arr) {
  return arr.reduce((h, c) => ((h[c] = true), h), {})
}

export default {
  makeMap,
}
