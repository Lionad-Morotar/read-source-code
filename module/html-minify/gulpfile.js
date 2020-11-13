const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const extract = require("gulp-html-extract")
const cssPurge = require('css-purge')

const rawDir = path.join(__dirname, './raw/*.html')
const distDir = path.join(__dirname, './dist')
const cssDir = path.join(__dirname, './dist/raw')

// TODO IO 操作非常要时间，应该在内存中一次性处理完

gulp.task('default', async () => {

  // extract css
  await gulp.src(rawDir)
    .pipe(extract({ sel: 'style' }))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest(distDir))

  // copy html
  await gulp.src(rawDir)
    .pipe(htmlmin({
      minifyJS: _ => '',
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeEmptyElements: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace: true,
      trimCustomFragments: true,
      useShortDoctype: true
    }))
    .pipe(gulp.dest(distDir))

  return

  // mini file
  fs.readdirSync(distDir).map(item => {
    if (item.endsWith('html')) {
      const file = path.join(__dirname, './dist', item)
      const htmlFile = fs.readFileSync(file)
      const concatedCSS = fs.readdirSync(cssDir)
        .filter(x => x.startsWith(item))
        .map(x => path.join(cssDir, x))
        .reduce((h, c) => h + '\n' + fs.readFileSync(c), '')

      cssPurge.purgeCSS(concatedCSS, {
        html: htmlFile,
        trim: true,
        shorten: true,
      }, function (error, result) {
        error && console.error(error)

        console.log(result.length)
      })
    }
  })

})