const fs = require('fs')
const path = require('path')
const parser = require("@babel/parser")
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const entry = './src/index.js'

function getFileContent(entry) {
    return fs.readFileSync(path.join(__dirname, entry), 'utf-8')
}

function resolveRelations({ entry, ast }) {
    const dependencies = {}
    traverse(ast, {
        ImportDeclaration({ node }){
            const requirePath = node.source.value
            const newFile = './' + path.join(path.dirname(entry), requirePath)
            dependencies[requirePath] = newFile
        }
    })
    return dependencies
}

// 解析文件，得到其依赖
function parse(entry) {
    const res = { entry }
    res.filename = path.join('./', entry.replace(path.dirname(entry), '')) || 'index.js'
    res.rawCode = getFileContent(entry)
    res.ast = parser.parse(res.rawCode, {
        sourceType: "module"
    })
    res.resolves = resolveRelations(res)
    res.parsedCode = babel.transformFromAst(res.ast, null, {
        presets: ["@babel/preset-env"]
    })
    return res
}

// 解析文件，得到其依赖图
function parseGraph(entry) {
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

function bundle(entry) {
    console.clear()
    console.log('\n[Bundle]', new Date(), entry)

    const graph = parseGraph(entry)

    console.log(graph)
}

bundle(entry)
