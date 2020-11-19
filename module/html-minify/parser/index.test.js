const minifier = require('./minifier')

const template = `
  <body>
    <h1>Test Q</h1>
    <style>
      /* 
        @Font-face{
          font-family:cIconfont-comment
        }
      */

      h1 {  }
      h1:after {  }
      h1::after {  }
      
      @font-face{
        font-family:cIconfont
      }
    </style>
  </body>
`
const result = minifier(template)

console.log(result)