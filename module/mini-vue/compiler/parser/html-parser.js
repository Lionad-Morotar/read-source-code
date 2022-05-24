import htmlParser from '../../../html-parser/index'

export default function parseHTML (...args) {
  const result = htmlParser(...args)

  const wash = doubleLinkedNode => {
    const { data, next } = doubleLinkedNode
    const node = {
      tag: data.tagName,
      ...data
    }

    delete node.tagName
    if (next && next.length > 0) {
      node.children = next.map(wash)
    }

    return node
  }
  
  return {
    root: result.root.map(wash)
  }
}