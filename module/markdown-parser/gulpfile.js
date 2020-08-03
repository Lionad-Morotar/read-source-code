const path = require('path')
const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const $ = gulpLoadPlugins()

const inputPath = process.env.INPUT
const inputFileDir = path.dirname(inputPath)
const outputDir = '../../build/'
const outputDest = path.join(outputDir, inputFileDir)

gulp.task('default', () => {
  gulp.src(['cedium.styl']).pipe($.stylus()).pipe(gulp.dest(outputDest))
})
