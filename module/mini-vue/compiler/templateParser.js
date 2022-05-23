import templateParser from '../../template-parser/index'

export default function parserWrapperToWashData (astNode) {
  return templateParser.parseText(astNode.data)
}