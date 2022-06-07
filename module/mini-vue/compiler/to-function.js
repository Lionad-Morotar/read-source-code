import parse from './parser/index.js'
import optimize from './optimizer.js'
import generate from './generator.js'

export function compileToFunctions (template) {
  const ast = parse(template)
  const optimizedAST = optimize(ast)
  const fnCode = generate.bind(this)(optimizedAST)
  return fnCode
}