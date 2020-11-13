const fs = require("fs")
const path = require('path')


// const purgeHtml = require("purgecss-from-html")
const cmd = require('node-cmd')

const gulpfilePath = path.join(__dirname, 'gulpfile.js')

// console.log(gulpfilePath)
// const item = 'dailiyun.html'
// const file = path.join(__dirname, './dist', item)
// cssPurge.purgeCSSFiles({
//   css_output: path.join(__dirname, `min.css`),
//   css: path.join(__dirname, './dist/css.css'),
//   html: file,
//   trim: true,
//   shorten: true
// })
// return

// html min
cmd.get(`gulp --gulpfile ${gulpfilePath} default`, async (error, data) => {
  error && console.error(error)

  // css min
  // const distDir = path.join(__dirname, './dist')

  // fs.readdirSync(distDir).map(item => {
  //   if (item.endsWith('html')) {
  //     const file = path.join(__dirname, './dist', item)
  //     const htmlFile = fs.readFileSync(file)
  //     const cssFiles = fs.readdirSync(cssDir)
  //       .filter(x => x.startsWith(item))
  //       .map(x => path.join(cssDir, x))
  //       .reduce((h, c) => h + fs.readFileSync(c), '')

  //     // fs.writeFileSync('./test.css', cssFiles)

  //     cssPurge.purgeCSS(cssFiles, {
  //       html: htmlFile,
  //       trim: true,
  //       shorten: true,
  //     }, function (error, result) {
  //       error && console.error(error)

  //       console.log(result.length)
  //     })
  //   }
  // })

})