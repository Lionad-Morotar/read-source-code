// @ts-ignore
/* eslint-disable */

require('mocha')
require('should')

const htmlParser = require('../../../build/module/html-parser/index')

const wash = node => node instanceof Array
  ? node.map(wash)
  : node 
  ? (node.next || []).map(wash).length
    ? ({ data: node.data, next: (node.next || []).map(wash) })
    : ({ data: node.data })
  : null
const parse = html => wash(htmlParser(html).root)

/********************************************
 * ****************************************** Normal Cases
 */

describe('Single Tag Cases', function () {
  it('simple tag', function () {
    parse(`<div></div>`).should.eql([{
      data: {
        tagName: 'div'
      }
    }])
  })
  it('unary tag', function () {
    parse(`<input />`).should.eql([{
      data: {
        tagName: 'input',
        isUnary: true
      }
    }])
  })
  it('comment tag', function () {
    parse(`<!-- hello world -->`).should.eql([{
      data: {
        tagName: 'text',
        text: 'hello world',
        isComment: true
      }
    }])
  })
})

/********************************************
 * ****************************************** Edge Cases
 */

describe('Edge Cases', function () {
  it('all text', function () {
    parse(`asdfasdf`).should.eql([{
      data: {
        tagName: 'text',
        text: 'asdfasdf'
      }
    }])
    // FIXME
    // parse(`<!-- asdfasdf`).should.eql([{
    //   data: {
    //     tagName: 'text',
    //     text: 'asdfasdf'
    //   }
    // }])
    parse(`-->asdfasdf`).should.eql([{
      data: {
        tagName: 'text',
        text: '-->asdfasdf'
      }
    }])
    parse(`asdfasdf-->`).should.eql([{
      data: {
        tagName: 'text',
        text: 'asdfasdf-->'
      }
    }])
  })
})

/********************************************
 * ****************************************** Complex Cases
 */

describe('Complex Cases', function () {
  it('test 1', function () {
    parse(require('./complex-case-1-input.js'))
      .should.eql(require('./complex-case-1-result.json'))
  })
})
