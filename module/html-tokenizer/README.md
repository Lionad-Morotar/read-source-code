HTML Tokenizer

```js
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

// results
[
  { tag: 'div', raw: '<div class="hello">', state: 'open' },
  { tag: 'input', isSelfClose: true, raw: '<input />', state: 'end' },
  { tag: 'table', raw: '<table>', state: 'open' },
  { tag: 'thead', raw: '<thead>', state: 'open' },
  { tag: '', raw: 'Hello', state: 'text' },
  { tag: 'thead', raw: '</thead>', state: 'end' },
  { tag: 'tbody', raw: '<tbody>', state: 'open' },
  { tag: 'tr', raw: '<tr>', state: 'open' },
  { tag: 'td', raw: '<td>', state: 'open' },
  { tag: '', raw: 'Hello', state: 'text' },
  { tag: 'td', raw: '</td>', state: 'end' },
  { tag: 'tr', raw: '</tr>', state: 'end' },
  { tag: 'tbody', raw: '</tbody>', state: 'end' },
  { tag: 'table', raw: '</table>', state: 'end' },
  { tag: 'div', raw: '</div>', state: 'end' }
]
```