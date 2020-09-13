/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')

  list.map(x => (map[x] = true))

  return expectsLowerCase ? x => map[x.toLowerCase()] : x => map[x]
}

/**
 * Always return false.
 */
export const no = () => false
