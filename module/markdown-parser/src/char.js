function isNewLine(c) {
  return c === '\n'
}

function isWhiteSpace(c) {
  return c === ' ' || c === '\u0009' || c === '\u00A0'
}

function isLetter(c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

function isDigit(c) {
  return c >= '0' && c <= '9'
}

function readNum(s) {
  const result = {
    value: '',
    idx: null,
  }
  let i = -1
  while (++i < s.length) {
    if (isDigit(s[i])) {
      result.value += s[i]
      result.idx = i
    }
  }
  return result
}

export default {
  isNewLine,
  isWhiteSpace,
  isLetter,
  isDigit,
  readNum,
}
