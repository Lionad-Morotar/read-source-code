var varRegexRaw = `\\s*[a-zA-Z_$][a-zA-Z_$0-9]*\\s*`
var fnCallRegexRaw = `(${varRegexRaw})\\(([^)]*)\\)`
var varRegex = new RegExp(varRegexRaw)
var fnCallRegex = new RegExp(fnCallRegexRaw)
var filterRegex = new RegExp(`_s\\(${varRegexRaw}(\\s*\\|\\s*(${varRegexRaw}|${fnCallRegexRaw})\\s*)*\\)`, 'g')

export default function filterParser (text) {
  const target = text.match(filterRegex)
  if (target) {
    const content = target[0].slice(3, -1)
    const [input, ...filters] = content.split(/\s*\|\s*/)
    const parsedResult = filters.reduce((result, filter) => {
      const fnCallMatch = filter.match(fnCallRegex)
      if (fnCallMatch) {
        const [, name, args = ''] = fnCallMatch
        return `_f("${name}")(${result},${args})`
      }
      const fnNameMatch = filter.match(varRegex)
      if (fnNameMatch) {
        const name = fnNameMatch[0]
        return `_f("${name}")(${result})`
      }
    }, input)
    return `_s(${text.replace(filterRegex, parsedResult)})`
  }
  return text
}