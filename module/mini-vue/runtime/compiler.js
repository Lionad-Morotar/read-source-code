import htmlParser from '../compiler/parser/html-parser'
import templateParser from '../compiler/parser/template-parser'
import optimize from '../compiler/optimizer'
import generate from '../compiler/generator'

export function compileToFunctions (template) {
  const ast = htmlParser(template, {
    text: templateParser
  })
  const optimizedAST = optimize(ast)
  const fnCode = generate(optimizedAST)
  return fnCode
}