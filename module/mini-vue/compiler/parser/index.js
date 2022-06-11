import htmlParser from './html-parser'
import templateParser from './template-parser'
import filterParser, { hasFilterExpression } from './filter-parser'

export default function parse (template) {
  return htmlParser(template, {
    text: templateParser,
    end (node) {
      const { attrs = {} } = node.data
      const events = {}
      let hasEvent = false
      Object.entries(attrs).map(([k, v]) => {
        if (k.startsWith('@')) {
          events[k.slice(1)] = v
          delete attrs[k]
          hasEvent = true
        }
        if (k.startsWith(':')) {
          if (hasFilterExpression(`_s(${v})`)) {
            const parsed = filterParser(`_s(${v})`)
            attrs[k] = parsed
          }
        }
      })
      if (hasEvent) {
        node.data.events = events
      }
    }
  })
}