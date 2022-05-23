/**
 * parse hook for HTML parser
 * @param {{ tagName:'text', text: string, isComment?: boolean }} textNode
 * @returns { ...textNode, expression: string }
 */
export default function parseText (textNode) {
  const text = textNode.text
  const tokenText = text.replace(/\{\{([^}]+)\}\}/g, (_, exp) => `{{_s(${exp.trim()})}}`)
  const tokens = tokenText.split(/\{\{([^}]+)\}\}/)
  const expressions = tokens.map(x => x.startsWith('_s') ? x : JSON.stringify(x))

  const condenseWhiteSpace = txt => txt.replace(/\s+/g, ' ')
  
  textNode.expression = condenseWhiteSpace(expressions.join('+'))
  return textNode
}
