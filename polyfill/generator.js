/**
 * 仅仅是模拟 Generator 的暂停运行机制
 * TODO: 以后有机会的话会通过解析代码实现一个真正的 Generator Polyfill
 * // let gen = Gen(
 * // `function helloGen(data) {
 * //     const x = 'world'
 * //     yield 'hello'
 * //     yield x
 * //     return data
 * // }`)
 */

function Gen(rawCode) {
    const context = {}

    // 匹配函数名
    const funNameMatch = rawCode.match(/function ([^\(]*)/)
    if (funNameMatch && funNameMatch[1]) {
        context.name = funNameMatch[1]
    }

    // 匹配函数参数长度
    const argsMatch = rawCode.match(/function [^\(]*\((.*)\)/)
    const args = argsMatch && argsMatch[1].split(',') || []
    context.length = args.length

    const raws = rawCode.match(/{([^}]*)}/)[1]
    const codes = raws.split(/([^\n;]*yield[^\n;]*\n|;)/)
        .filter(Boolean)
        .map(x => x.replace(/yield/g, 'return'))
    codes[0] += codes[1]
    codes.splice(1, 1)

    return function (...datas) {
        /* 模拟初始化传参 */
        const decTemplate = i => `var ${args[i]} = "${datas[i]}"`
        const fakeDeclaration = Array(datas.length).fill('')
            .map((x, i) => decTemplate(i))
            .join('\n')
        eval(fakeDeclaration)

        function next() {
            const run = codes.shift()
            const value = eval(`(function () { ${run} }).bind(context)()`)
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
    yield 'hello'
    yield 'world'
    yield data1
    yield data2
}`)('DATA1', 'DATA2')

console.log('1：', hello.next())
console.log('2：', hello.next())
console.log('3：', hello.next())
console.log('4：', hello.next())

// >>> 1： { value: 'hello', next: [Function: next], done: false }
// >>> 2： { value: 'world', next: [Function: next], done: false }
// >>> 3： { value: 'DATA1', next: [Function: next], done: false } 
// >>> 4： { value: 'DATA2', next: [Function: next], done: true }