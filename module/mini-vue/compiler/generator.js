import { error } from '../utils'

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
  const content = astNode.expression || JSON.stringify(astNode.text)
  if (astNode.isComment) {
    return `_comment(${content})`
  } else {
    return `_text(${content})`
  }
}

/**
 * VNode 数据对象详细配置
 * @see https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
 */
function genData (astNode) {
  let data = ''
  astNode.attrs && (data += `attrs:${genProps(astNode.attrs)},`)
  astNode.events && (data += `events:${genHandlers(astNode.events)},`)
  return data ? `{${data}}` : ''
}

function genProps (props) {
  let staticContent = ''
  let dynamicContent = ''
  Object.entries(props).map(([k,v]) => {
    if (k.startsWith(':')) {
      dynamicContent += `"${k.slice(1)}",${v},`
    } else {
      staticContent += `"${k}":${JSON.stringify(v)},`
    }
  })
  staticContent = staticContent.replace(/,$/, '')
  dynamicContent = dynamicContent.replace(/,$/, '')
  if (dynamicContent) {
    return `_d({${staticContent}}, [${dynamicContent}])`
  } else {
    return `{${staticContent}}`
  }
}

function genHandlers (props) {
  let dynamicContent = ''
  Object.entries(props).map(([k,v]) => {
    const handler = genHandler(v)
    dynamicContent += `"${k}",${handler},`
  })
  dynamicContent = dynamicContent.replace(/,$/, '')
  return `_d({}, [${dynamicContent}])`
}

function genHandler (evtTemplate) {
  const fnRegex = /^\([^)]*?\)\s*=>|function\s+\([^)]*?\)\s*\{[^}]*?\}/
  const isFnExp = fnRegex.test(evtTemplate)
  if (isFnExp) {
    return evtTemplate
  } else {
    error('wrong event')
    return '()=>{}'
  }
}

function genChildren (astNode) {
  let children = ''
  if (astNode.children && astNode.children.length) {
    children += astNode.children.map(genElement).join(',')
  }
  return children ? `[${children}]` : ''
}
