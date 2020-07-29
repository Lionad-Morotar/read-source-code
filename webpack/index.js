const fs = require('fs')
const path = require('path')
const parser = require("@babel/parser")
const traverse = require('@babel/traverse').default

const entry = path.join(__dirname, './src/index.js')

function getFileContent({ entry: path }) {
    // 自动后缀补充
    const post = ['', '.js', 'json', '/.js', '/.json']
    while (post.length) {
        const postFix = post.shift()
        let realPath = path + postFix
        let res = null
        try {
            res = fs.readFileSync(realPath, 'utf-8')
        } 
        catch(error) {
            /* do nothing and try next postFix */
        }
        finally {
            if (res) return res
        }
    }
    throw new Error('Error file path')
}

function resolveRelations({ entry, code }) {
    const ast = parser.parse(code, {
        sourceType: "module"
    })
    const dependencies = {}
    traverse(ast, {
        ImportDeclaration({ node }){
            const requirePath = node.source.value
            const newFile = path.join(path.dirname(entry), requirePath)
            dependencies[requirePath] = newFile
        }
    })
    return dependencies
}

// 解析文件内容，得到其依赖
function parse(entry) {
    const res = { entry }
    res.code = getFileContent(res)
    res.resolves = resolveRelations(res)
    return res
}

// 解析文件内容，得到其依赖图
function parseEntry(entry) {
    const unResolve = [entry]
    const module = []
    while (unResolve.length) {
        const item = unResolve.shift()
        const resolveRes = parse(item)
        module.push(resolveRes)
        Object.values(resolveRes.resolves).map(x => unResolve.push(x))
    }
    return module
}

function bundle(entry) {
    console.log('\n[Bundle]', new Date(), entry)

    const module = parseEntry(entry)

    console.log(module)
}

bundle(entry)
