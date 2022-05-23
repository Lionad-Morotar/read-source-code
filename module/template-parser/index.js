/**
 * parse hook for HTML parser
 * @param {{ tagName:'text', text: string, isComment?: boolean }} textNode
 * @returns { ...textNode, expression: string }
 */
function parseText (textNode) {
  const text = textNode.text
  const tokenText = text.replace(/\{\{([^}]+)\}\}/g, (_, exp) => exp ? `{{_s(${exp.trim()})}}` : '')
  const tokens = tokenText.split(/\{\{([^}]+)\}\}/).filter(Boolean)
  const expressions = tokens.map(x => x.startsWith('_s') ? x : JSON.stringify(x))

  const condenseWhiteSpace = txt => txt.replace(/\s+/g, ' ')
  
  textNode.expression = condenseWhiteSpace(expressions.join('+'))
  return textNode
}

const exec = (text, vars) => {
  const expression = parseText({ text }).expression
  return (new Function('vars', `
    const _s = x =>
      x === null 
      ? ''
      : x instanceof Object
        ? JSON.stringify(x)
        : String(x)
    with (vars) {
      return ${expression}
    }
  `))(vars)
}

export default {
  parseText,
  exec
}