/**
 * HTML Tokenizer
 * @see https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/#The_tokenization_algorithm
 */
import utils from '../../utils/index.js'
import chars from '../../utils/char.js'

const charCodes = {
  lt: '<'.charCodeAt(0),
  gt: '>'.charCodeAt(0),
  slash: '/'.charCodeAt(0),
}
const charCodesMap = utils.makeMap(Object.values(charCodes))

export default function Tokenize(raw) {
  if (!(this instanceof Tokenize)) return new Tokenize(raw)
  this.state = null
  this.lastState = null
  this.stash = ''
  this.tagState = null
  this.lastTagState = null
  this.isEndTag = null
  this.isTagDone = true
  this.raw = raw || null
  this.offset = -1
  this.tokens = []
  this.data = {}
}

Tokenize.prototype.recState = function recState(state) {
  if (state === this.state) return
  this.lastState = this.state
  this.state = state
}
Tokenize.prototype.recTagState = function recTagState(state) {
  if (state === this.tagState) return
  this.lastTagState = this.tagState
  this.tagState = state
}

Tokenize.prototype.flush = function flush(state) {
  Object.assign(this.data, Object.assign({ tag: '', raw: this.stash, state }, this.data))
  this.tokens.push(this.data)
  this.stash = ''
  this.data = {}
  this.isEndTag = null
}

Tokenize.prototype.exec = function exec() {
  if (this.raw) {
    while (++this.offset < this.raw.length) {
      const cur = this.raw[this.offset]
      const curCharCode = cur.charCodeAt(0)
      let curCharState = null

      /* current char state */
      if (charCodesMap[curCharCode]) {
        if (cur === '<') {
          curCharState = 'tag-open'
        }
        if (cur === '>') {
          curCharState = 'tag-close'
        }
        curCharState && this.recTagState(curCharState)
      } else {
        if (chars.isWhiteSpace(cur)) {
          curCharState = 'space'
        } else {
          curCharState = 'text'
        }
      }
      curCharState && this.recState(curCharState)

      // * for test
      // console.log(cur, curCharState, this.isTagDone, this.lastState)

      /* flush data */
      if (cur === '>') {
        this.stash += cur
        this.flush(this.isEndTag ? 'end' : 'open')
        this.isTagDone = true
        continue
      }
      if (cur === '<') {
        this.isTagDone = false
        if (['text', 'space'].includes(this.lastState)) {
          this.flush('text')
          this.stash += cur
          continue
        }
      }
      if (cur === '/') {
        this.isEndTag = true
        if (this.data.tag) this.data.isSelfClose = true
      }
      if (chars.isAlpha(cur) || chars.isNumber(cur)) {
        if (this.lastState === 'tag-open') {
          this.data.tag || (this.data.tag = '')
          this.data.tag += cur
        }
      }
      this.stash += cur
    }
  }
  return this
}

const testHTML = `<div class="hello">
  <input />
  <table>
    <thead>Hello</thead>
    <tbody>
      <tr>
        <td>Hello</td>
      </tr>
    </tbody>
  </table>
</div>
`

console.log(
  Tokenize(testHTML)
    .exec()
    .tokens
    // remove line-wrap
    .filter(x => x.raw.match(/[a-zA-Z0-9]/))
)
