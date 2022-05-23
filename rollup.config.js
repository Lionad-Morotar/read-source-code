const path = require('path')
const cmd = require('node-cmd')

const useHTMLTemplate = !!process.env.HTML
const runGulp = !!process.env.GULP
const shouldRun = !!process.env.RUN
const openDevServer = !!process.env.serve
const inputPath = process.env.INPUT
const inputFileDir = path.dirname(inputPath)
const outputDir = './build/'
const outputDest = `${outputDir}${inputFileDir}`

export default {
  input: inputPath,
  plugins: [
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-node-resolve')(),
    useHTMLTemplate &&
      require('rollup-plugin-generate-html-template')({
        template: path.join(inputFileDir, '/index.html'),
      }),
    // 忘了为啥要 copy 了，暂时禁用
    // require('rollup-plugin-copy')({
    //   targets: [{ src: inputFileDir + '/**/*', dest: outputDest }],
    // }),
    runGulp && {
      name: 'run-gulp',
      buildEnd: async () => {
        return await new Promise(resolve => {
          // Should change global node.exe path in gulp.ps1,
          // because of rollup use NodeJS@14.4 and gulp@3 use NodeJS@8.15
          cmd.get(`gulp --gulpfile ${inputFileDir}/gulpfile.js default`, async (error, data) => {
            error ? console.error(error) : console.info(data)
            resolve()
          })
        })
      },
    },
    openDevServer && require('rollup-plugin-browsersync')({ server: outputDest }),
    shouldRun && require('@rollup/plugin-run')(),
  ],
  external: [/node_modules/],
  output: {
    name: 'module',
    file: `${outputDir}${inputPath}`,
    format: 'umd',
    sourcemap: true,
  },
  watch: {
    include: [
      inputFileDir + '/**/*.js',
      inputFileDir + '/index.html'
    ]
  },
}
