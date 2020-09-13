import { parse } from './compiler/parser'
import { generate } from './compiler/codegen'
import { createFunction } from './compiler/to-function'
import { createElm } from './vdom/patch'

import { initRender } from './instance/render'

function Vue(options) {
  Object.assign(this, options)

  initRender(this)

  // mount event on vm
  for (let event in this.methods) {
    this[event] = this.methods[event]
  }

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

  // gen fn
  // this.code.render = `with(this){return _c('div',{on:{"@click":handleClick()}})}`
  this.render = createFunction(this.code.render)

  // gen vnode
  const vnode = this.render.call(this)
  // console.log(vnode)

  // TODO

  const testRender = createFunction(`with(this){ handleClick() }`)
  const exec = testRender.call(this)

  this.$mount = selector => {
    document.querySelector(selector).appendChild(nodes)
  }
}

const template = `<div @click="handleClick"> Click Me ! </div>`

const vue = new Vue({
  template,
  methods: {
    handleClick() {
      console.log('handleClick')
    },
  },
})

// console.log(vue)
