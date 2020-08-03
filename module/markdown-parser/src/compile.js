const compilers = {
  hr: _ => `<hr />`,
  header: ({ data }) => `<h${data.level}>${data.title}</h${data.level}>`,
  image: ({ data }) => `<img src="${data.src}" alt="${data.alt}" />`,
  code: ({ data }) => `<code>${data.text}</code>`,
  delete: ({ data }) => `<del>${data.text}</del>`,
  bold: ({ data }) => `<em>${data.text}</em>`,
  italic: ({ data }) => `<i>${data.text}</i>`,
  link: ({ data }) => `<a href="${data.href}" target="_blank" rel="nofollow">${data.text}</a>`,
  codeblock: ({ data }) => `<pre>${data.code}</pre>`,
  'unorder-list': ({ children }) => {
    return `<ul>${children.map(c => `<li>${c.html}</li>`).join('')}</ul>`
  },
  'order-list': ({ children }) => {
    return `<ol>${children.map(c => `<li>${c.html}</li>`).join('')}</ol>`
  },
  blockquote: ({ children }) => {
    return `<blockquote>${children.map(c => `<p>${c.html}</p>`).join('')}</blockquote>`
  },
  text: ({ html }, parent) => {
    const parentType = parent ? parent.type : null
    switch (parentType) {
      case 'order-list':
      case 'unorder-list':
        return `<li>${html}</li>`
      default:
        return !parentType ? `<p>${html}</p>` : html
    }
  },
}

function parse(node, parent) {
  node.html = node.flow
  const children = node.children.length ? node.children : []
  children.map(child => {
    const childHTML = parse(child, node)
    node.html = node.html.replace(child.flow, childHTML)
  })
  const compiler = compilers[node.type]
  return compiler ? compiler(node, parent) : node.flow
}

export default {
  parse,
}
