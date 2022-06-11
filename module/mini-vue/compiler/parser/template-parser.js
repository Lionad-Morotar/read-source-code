import templateParser from '../../../template-parser/index'
import filterParser from './filter-parser'

export default function parserWrapperToWashData (astNode) {
  const nodeData = templateParser.parseText(astNode.data)
  if (nodeData.expression) {
    nodeData.expression = filterParser(nodeData.expression)
  }
  return nodeData
}