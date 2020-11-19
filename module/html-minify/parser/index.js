const fs = require('fs')
const path = require('path')

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
    <h3>Test W<span>Test</span></h3>
    <style>
      h3 span {
        color: black;
      }
      h3 span {

      }
      h3 p {
        color: red;
      }
    </style>
    <script>
      var t = 1
      console.log(t)
    </script>
  </body>
`

const minhtml = minifier(template)

fs.writeFileSync(path.join(__dirname, '../dist/minhtml.html'), minhtml)