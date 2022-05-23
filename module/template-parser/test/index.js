// @ts-ignore
/* eslint-disable */

require('mocha')
require('should')

const parseText = require('../../../build/module/template-parser/index')

const parse = text => parseText({ text }).expression

/********************************************
 * ****************************************** Normal Cases
 */

describe('Normal Cases', function () {
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
