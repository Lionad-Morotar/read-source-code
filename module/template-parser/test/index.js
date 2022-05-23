// @ts-ignore
/* eslint-disable */

require('mocha')
require('should')

const { parseText, exec } = require('../../../build/module/template-parser/index')

const parse = text => parseText({ text }).expression

describe('Parse text to expression works fine', function () {
  it('all text', function () {
    parse(`hello world`).should.eql(`"hello world"`)
  })
  it('normal usage', function () {
    parse(`111 {{ hello }} 222 {{ world }} 333`)
      .should.eql(`"111 "+_s(hello)+" 222 "+_s(world)+" 333"`)
  })
  it('condensed whitespaces', function () {
    parse(`111 {{hello   }}   222 {{ world }}333`)
      .should.eql(`"111 "+_s(hello)+" 222 "+_s(world)+"333"`)
  })
})

describe('Template evaluation works fine', function () {
  it('normal usage', function () {
    exec(`111 {{ hello }} 222 {{ world }} 333`, {
      hello: 'hello!',
      world: { val: 'world!' }
    }).should.eql(`111 hello! 222 {"val":"world!"} 333`)
  })
})
