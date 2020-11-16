const parse = require('./parser')

const template = `
<html>
  <head>adfasdfasf</head>
  <body>
    <h1 class="name" id="asdf">Test</h1>
    <style>
      h1 {
        color: red;
      }
    </style>
    <script>
      var t = 1
      console.log(t)
    </script>
  </body>
</html>
`

const res = parse(template)

console.log('res: ', res.children[1].children[0])