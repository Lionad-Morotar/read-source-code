function makeMap(arr) {
  return arr.reduce((h, c) => ((h[c] = true), h), {})
}

const testHTML = `<div class="hello">
  <span><input /></span>
</div>
`

const charCodes = {
  lt: '<'.charCodeAt(0),
  gt: '>'.charCodeAt(0),
  slash: '/'.charCodeAt(0),
}
const charCodesMap = makeMap(Object.values(charCodes))

function peekNext(s, i) {
  return s[i + 1]
}

function Tokenize(raw) {
  if (!(this instanceof Tokenize)) return new Tokenize(raw)
  this.state = null
  this.lastState = null
  this.stash = ''
  this.tagState = null
  this.lastTagState = null
  this.waitClose = null
  this.raw = raw || null
  this.offset = -1
  this.tokens = []
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
  this.tokens.push([state, this.stash])
  this.stash = ''
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
        this.recTagState(curCharState)
      } else {
        curCharState = 'text'
      }
      this.recState(curCharState)

      /* flush data */
      if (this.stash) {
        if (this.state === 'tag-close') {
          this.stash += cur
          this.flush(this.waitClose ? 'tag-end' : 'tag-start')
          this.waitClose = null
          continue
        }
        if (this.state === 'tag-open') {
          if (this.lastState === 'text') {
            this.flush('text')
            this.stash += cur
            continue
          }
        }
        if (cur === '/') {
          this.waitClose = true
        }
      }
      this.stash += cur
    }
  }
  return this
}

console.log(Tokenize(testHTML).exec().tokens)
