const parse = require('./parser')
const minifier = require('./minifier')

const template = `
  <body>
    <h1>Test Q</h1>
    <style>
      h1 {
        color: red;
      }
    </style>
    <script>
      var t = 1
      console.log(t)
    </script>
    <h2>Test W</h2>
    <style>
      h2 {
        color: blue;
      }
    </style>
    <script>
      var t = 1
      console.log(t)
    </script>
    <h3>Test W</h3>
    <style>
      h3 {
        color: black;
      }
    </style>
    <script>
      var t = 1
      console.log(t)
    </script>
  </body>
`

const ast = parse(template)

const { root, style } = minifier(ast)

console.log('style: ', style)

// console.log('root: ', root)