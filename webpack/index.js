const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

function getFileContent (entry) {
  return fs.readFileSync(path.join(__dirname, entry), 'utf-8')
}

function resolveRelations ({ entry, ast }) {
  const dependencies = {}
  traverse(ast, {
    ImportDeclaration ({ node }) {
      const requirePath = node.source.value
      const newFile = './' + path.join(path.dirname(entry), requirePath)
      dependencies[requirePath] = newFile
    }
  })
  return dependencies
}

// 解析文件，得到其依赖
function parse (entry) {
  const res = { entry }
  res.filename = path.join('./', entry.replace(path.dirname(entry), '')) || 'index.js'
  res.rawCode = getFileContent(entry)
  res.ast = parser.parse(res.rawCode, {
    sourceType: 'module'
  })
  res.resolves = resolveRelations(res)
  // 解析结果中的 _interopRequireDefault 函数：
  // 对没有 exports 的对象添加 exports 属性并指向自身
  res.parsedCode = babel.transformFromAst(res.ast, null, {
    presets: ['@babel/preset-env']
  })
  return res
}

// 解析文件，得到其依赖图
function parseGraph (entry) {
  const unResolve = [entry]
  const module = []
  while (unResolve.length) {
    const item = unResolve.shift()
    const parsed = parse(item)
    module.push(parsed)
    Object.values(parsed.resolves).map(x => unResolve.push(x))
  }
  const graph = {}
  module.map(m => {
    graph[m.entry] = {
      code: m.parsedCode.code,
      dependencies: m.resolves
    }
  })
  return graph
}

function chunk (entry) {
  console.clear()
  console.log('\n[Bundle]', new Date(), entry)
  const graph = parseGraph(entry)
  return graph
}

function webpack () {
  const configFile = require('./config/webpack')
  const entry = configFile.entry
  const graph = chunk(entry)
  const bundle = require('./wrapper')({ entry, graph })

  const outputDir = configFile.output || './dist'
  const bundleName = 'bundle.js'
  const output = path.join(outputDir, bundleName)
  fs.writeFileSync(output, bundle)
}

webpack()
