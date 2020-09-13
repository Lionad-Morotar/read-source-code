import { parse } from './compiler/parser'
import { generate } from './compiler/codegen'

function Vue(options) {
  Object.assign(this, options)

  // parse html to ast
  this.ast = parse(this.template)
  // console.log(this.ast)

  // resolve events
  this.ast.events = this.ast.events || {}
  this.ast.attrsList.map(attr => {
    if (attr.name === '@click') {
      this.ast.events['@click'] = attr
    }
  })

  // gen code from ast
  this.code = generate(this.ast)
  // console.log(this.code)

  this.$mount = selector => {
    document.querySelector(selector).appendChild(nodes)
  }
}

const template = `<div @click="handleClick" style="background: #888; border: solid 1px #333;"> Click Me ! </div>`

const vue = new Vue({
  template,
  methods: {
    handleClick() {
      console.log('handleClick')
    },
  },
})

console.log(vue)
