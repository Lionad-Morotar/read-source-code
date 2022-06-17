import htmlParser from './html-parser'
import templateParser from './template-parser'
import filterParser, { hasFilterExpression } from './filter-parser'

export default function parse (template) {
  return htmlParser(template, {
    text: templateParser,
    end (node) {
      // TODO CreateObject(x), getter => x.changed = true
      const { tagName, attrs = {}, events = {} } = node.data

      Object.entries(attrs).map(([k, v]) => {
        // handle events
        if (k.startsWith('@')) {
          events[k.slice(1)] = v
          delete attrs[k]
          hasEvent = true
        }
        // handle filters in prop
        if (k.startsWith(':')) {
          if (hasFilterExpression(`_s(${v})`)) {
            const parsed = filterParser(`_s(${v})`)
            attrs[k] = parsed
          }
        }
      })

      node.data.events = events
    }
  })
}