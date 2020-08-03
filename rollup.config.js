const path = require('path')

const shouldRun = !!process.env.RUN
const openDevServer = !!process.env.serve
const inputPath = process.env.INPUT
const inputFileDir = path.dirname(inputPath)
const outputDir = './build/'
const outputDest = `${outputDir}${inputFileDir}`

export default {
  input: inputPath,
  plugins: [
    require('rollup-plugin-copy')({
      targets: [{ src: inputFileDir + '/**/*', dest: outputDest }],
    }),
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-node-resolve')(),
    shouldRun && require('@rollup/plugin-run')(),
    openDevServer &&
      require('rollup-plugin-serve')({
        /** @see https://www.npmjs.com/package/rollup-plugin-serve */
        verbose: false,
        host: 'localhost',
        port: 10001,
        contentBase: outputDest,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
  ],
  external: [/node_modules/],
  output: {
    name: 'flowchart',
    file: `${outputDir}${inputPath}`,
    format: 'umd',
    sourcemap: true,
  },
  watch: {
    include: inputFileDir + '/**/*.js',
  },
}
