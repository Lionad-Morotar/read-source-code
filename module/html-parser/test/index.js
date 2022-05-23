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
const parse = (...args) => wash(htmlParser(...args).root)

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
 * ****************************************** Parse Hooks
 */

describe('Parse Hooks', function () {
  it('parseHook.comment', function () {
    parse(`<!-- comment-1 --><div><!-- comment-2 --></div><!-- comment-3 -->`, {
      comment (node) {
        node.data.text = node.data.text.replace('comment', 'comments')
      }
    }).should.eql([
      {
        data: {
          tagName: 'text',
          text: 'comments-1',
          isComment: true
        }
      },
      {
        data: {
          tagName: 'div'
        },
        next: [{
          data: {
            tagName: 'text',
            text: 'comments-2',
            isComment: true
          }
        }]
      },
      {
        data: {
          tagName: 'text',
          text: 'comments-3',
          isComment: true
        }
      }
    ])
  })
  it('parseHook.text', function () {
    parse(`text-1<div>text-2</div>text-3`, {
      text (node) {
        node.data.text = node.data.text.replace('text', 'texts')
      }
    }).should.eql([
      {
        data: {
          tagName: 'text',
          text: 'texts-1',
        }
      },
      {
        data: {
          tagName: 'div'
        },
        next: [{
          data: {
            tagName: 'text',
            text: 'texts-2',
          }
        }]
      },
      {
        data: {
          tagName: 'text',
          text: 'texts-3',
        }
      }
    ])
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
