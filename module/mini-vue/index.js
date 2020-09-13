import { parse } from './compiler/parser'

function Vue(options) {
  Object.assign(this, options)

  const ast = parse(this.template)

  this.$mount = selector => {
    document.querySelector(selector).appendChild(nodes)
  }
}

const template = `<div @click="handleClick" style="background: #888; border: solid 1px #333;"> Click Me ! </div>`

new Vue({
  template,
  methods: {
    handleClick() {
      console.log('handleClick')
    },
  },
})
