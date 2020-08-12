function isWhiteSpace(c) {
  return c === ' ' || c === '\u0009' || c === '\u00A0'
}

function isAlpha(c) {
  const inaz = 'a' <= c && 'z' >= c
  const inAZ = 'A' <= c && 'Z' >= c
  return inaz || inAZ
}

function isNumber(c) {
  return '0' <= c && '9' >= c
}

function isPlain(c) {
  return inAZ(c) || in09(c) || isWhiteSpace(c)
}

export default {
  isWhiteSpace,
  isAlpha,
  isNumber,
  isPlain,
}
