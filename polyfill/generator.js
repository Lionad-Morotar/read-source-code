/**
 * 仅仅是模拟 Generator 的暂停运行机制
 * TODO: 以后有机会的话会通过解析代码实现一个真正的 Generator Polyfill
 */

function Gen(rawCode) {
    const self = this

    // 匹配函数名
    const funNameMatch = rawCode.match(/function ([^\(]*)/)
    if (funNameMatch && funNameMatch[1]) {
        self.name = funNameMatch[1]
    }

    // 匹配函数参数长度
    const argsMatch = rawCode.match(/function [^\(]*\((.*)\)/)
    const args = argsMatch && argsMatch[1].split(',') || []
    self.length = args.length

    // 将程序源码根据 yield 分段
    const raws = rawCode.match(/{([^}]*)}/)[1]
    const codes = raws.split(/([^\n;]*yield[^\n;]*\n|;)/)
        .filter(Boolean)
        .map(x => x.replace(/yield/g, 'return'))
    codes[0] += codes[1]
    codes.splice(1, 1)

    return function (...datas) {
        /* 模拟生成器初始化时的传参 */
        const decTemplate = i => `var ${args[i]} = datas[${i}]`
        const fakeArguments = Array(datas.length).fill('')
            .map((x, i) => decTemplate(i))
            .join('\n')
        eval(fakeArguments)

        /* 模拟生成器内部变量声明 */
        const runner = (function runner(code) {
            const declareStore = []
            code.replace(/(var)\s*([^=\s]*)\s*=\s*([^\n;]*)/g, (...args) => (declareStore.push(args), ''))
            const declarations = declareStore.map(arg => {
                const [declare, declareType, varName, varValue] = arg
                return declare
            })
            ;(0, eval)(declarations.join('\n'))
            return eval(`(function (...datas) { ${code} })(...datas)`)
        }).bind(self)

        // Generator.next
        function next() {
            const run = codes.shift()
            const value = runner(run)
            return {
                value,
                next,
                done: codes.length === 0
            }
        }

        return {
            next,
            done: codes.length === 0
        }
    }
}

let hello = Gen(
`function helloGen(data1, data2) {
    var x = 'X'
    yield 'hello'
    yield 'world'
    yield data1
    yield data2
    yield arguments[1]
    yield x
}`)('DATA1', ['DATA2'])

console.log('1：', hello.next())
console.log('2：', hello.next())
console.log('3：', hello.next())
console.log('4：', hello.next())
console.log('5：', hello.next())
console.log('6：', hello.next())

// >>> 1： { value: 'hello', next: [Function: next], done: false }
// >>> 2： { value: 'world', next: [Function: next], done: false }    
// >>> 3： { value: 'DATA1', next: [Function: next], done: false }    
// >>> 4： { value: [ 'DATA2' ], next: [Function: next], done: false }
// >>> 5： { value: [ 'DATA2' ], next: [Function: next], done: false }
// >>> 6： { value: 'X', next: [Function: next], done: true }
