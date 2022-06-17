import { error, removeLastComma } from '../utils'

let curVM = null

export default function generate (ast) {
  curVM = this
  const root = ast.root
  const code = root.map(genElement).map(x => x.code)
  curVM = null

  // * for debug
  // console.log('Generate: ', code.join(','))

  if (markIf) {
    error('wrong match between :if and :else')
  }
  if (markShowIf) {
    error('wrong match between :show-if and :else')
  }

  return `with (this) { return [${code.join(',')}] }`
}

function genElement (astNode) {
  if (astNode.text) {
    return genText(astNode)
  }

  const hasFor = astNode?.attrs?.hasOwnProperty(':for')
  if (hasFor) {
    return genFor(astNode)
  }

  const prefix = handlePrefix(astNode) || ''
  const postfix = handlePostfix(astNode) || ''
  processModel(astNode)
  processData(astNode)
  const data = genData(astNode)
  const children = genChildren(astNode)

  return {
    code: `${prefix}_c('${astNode.tag}'${data ? `,${data}` : ''}${children ? `${data ? ',' : ',undefined,'}${children}` : ''})${postfix}`,
    velse: !!postfix
  }
}

function genText (astNode) {
  const content = astNode.expression || JSON.stringify(astNode.text)
  if (astNode.isComment) {
    return { code: `_comment(${content})` }
  } else {
    return { code: `_text(${content})` }
  }
}

// handle v-if
let markIf = null
function handlePrefix (astNode) {
  const { attrs = {} } = astNode
  if (attrs.hasOwnProperty(':if')) {
    markIf = true
    const ifRes = attrs[':if']
    delete attrs[':if']
    return `(${ifRes})?(`
  }
  if (attrs.hasOwnProperty(':else')) {
    if (markIf) {
      return `):(`
    }
  } 
}

// handle v-else
function handlePostfix (astNode) {
  const { attrs = {} } = astNode
  if (attrs.hasOwnProperty(':else')) {
    if (markIf) {
      markIf = null
      delete attrs[':else']
      return `)`
    }
  }
}

// handle v-for
function genFor (astNode) {
  const matchRes = astNode.attrs[':for'].match(/\(([^)]*)\)\s*in\s*(.*)/)
  if (matchRes) {
    const [_, args, list] = matchRes
    delete astNode.attrs[':for']
    return {
      code: `..._l(${list}, function (${args}) { return ${genElement(astNode).code} })`
    }
  }
  error('args of :for match failed')
}

// handle v-model
function processModel (astNode) {
  const events = astNode.events || (astNode.events = {})
  const attrs = astNode.attrs || (astNode.attrs = {})
  if (attrs.hasOwnProperty(':model')) {
    const modelEXP = attrs[':model']
    // TODO & FIXME
    const { prop = 'value', event = 'input' } = {}
    attrs[`:${prop}`] = modelEXP
    events[event] = `function (evt) { ${prop} = evt.target.value }`
  }
}

// TODO ? move processData to parser/index.js
let markShowIf = null
function processData (astNode) {
  const { attrs = {}, styles = {} } = astNode

  // handle v-show-if & v-else
  if (attrs.hasOwnProperty(':show-if')) {
    markShowIf = attrs[':show-if']
    styles[':display'] = `${markShowIf} ? 'none' : 'unset'`
    delete astNode.attrs[':show-if']
  }
  if (attrs.hasOwnProperty(':else')) {
    styles[':display'] = `${markShowIf} ? 'unset' : 'none'`
    delete astNode.attrs[':else']
    markShowIf = null
  }
  astNode.styles = styles
}

/**
 * VNode 数据对象详细配置
 * @see https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
 */
function genData (astNode) {
  let data = ''
  astNode.attrs && (data += `attrs:${genProps(astNode.attrs)},`)
  astNode.events && (data += `events:${genHandlers(astNode.events)},`)
  astNode.styles && (data += `style:${genStyles(astNode.styles)},`)
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
  staticContent = removeLastComma(staticContent)
  dynamicContent = removeLastComma(dynamicContent)
  if (dynamicContent) {
    return `_d({${staticContent}}, [${dynamicContent}])`
  } else {
    return `{${staticContent}}`
  }
}

function genHandlers (props) {
  let dynamicContent = ''
  Object.entries(props).map(([k,v]) => {
    const { name, handler } = genHandler(v, k)
    dynamicContent += `"${name}",${handler},`
  })
  dynamicContent = removeLastComma(dynamicContent)
  return `_d({}, [${dynamicContent}])`
}

function genHandler (evtTemplate, name) {
  const [realName, ...modifiers] = name.split('.')
  const modifiersContent = modifiers
    .map(x => {
      if (x === 'stop') {
        return `e.stopPropagation()`
      } else if (x === 'prevent') {
        return `e.preventDefault()`
      }
    })
    .join(';')

  const fnRegex = /^\([^)]*?\)\s*=>|function\s+\([^)]*?\)\s*\{[^}]*?\}/
  const isFnExp = fnRegex.test(evtTemplate)
  if (isFnExp) {
    return {
      name: realName,
      handler: evtTemplate
    }
  } else if (curVM.hasOwnProperty(evtTemplate)) {
    return {
      name: realName,
      handler: `(e, ...args) => { ${modifiersContent}; ${evtTemplate}(e, ...args) }`
    }
  }
  error('wrong event')
}

function genStyles (props) {
  return genProps(props)
}

function genChildren (astNode) {
  let children = ''
  if (astNode.children && astNode.children.length) {
    children += astNode.children
      .map(genElement)
      .reduce((h, c) => {
        const { code, velse } = c
        return velse
          ? `${h}${code}`
          : `${h}${h?',':''}${code}`
      }, '')
  }
  return children ? `[${children}]` : ''
}
