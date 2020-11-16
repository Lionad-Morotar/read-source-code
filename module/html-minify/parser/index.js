const Parse = require('./html-parser')

const html = `
<html>
  <head></head>
  <body>
    <h1>Test</h1>
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

Parse(
  html,
  {
    start(...args) {
      console.log(args)
    },
    end(...args) {
      console.log(args)
    }
  }
)