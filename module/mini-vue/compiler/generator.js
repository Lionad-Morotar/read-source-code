export default function generate (ast) {
  const root = ast.root
  const code = root.map(genElement)
  return `with(this){return [${code}]}`
}

function genElement (astNode) {
  if (astNode.text) {
    return genText(astNode)
  }
  const data = genData(astNode)
  const children = genChildren(astNode)
  return `_c('${astNode.tag}'${data ? `,${data}` : ''}${children ? `${data ? ',' : ',undefined,'}${children}` : ''})`
}

function genText (astNode) {
  if (astNode.isComment) {
    return `_comment(${JSON.stringify(astNode.text)})`
  } else {
    return `_text(${JSON.stringify(astNode.text)})`
  }
}

function genData (astNode) {
  let data = ''
  astNode.attrs && (data += `attrs:{${genProps(astNode.attrs)}}`)
  return data ? `{${data}}` : ''
}

function genProps (attrs) {
  let props = ''
  Object.entries(attrs).map(([k,v]) => {
    props += `${JSON.stringify(k)}:${JSON.stringify(v)},`
  })
  return props.replace(/,$/, '')
}

function genChildren (astNode) {
  let children = ''
  if (astNode.children && astNode.children.length) {
    children += astNode.children.map(genElement).join(',')
  }
  return children ? `[${children}]` : ''
}
