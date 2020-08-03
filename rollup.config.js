const path = require('path')

const shouldRun = !!process.env.RUN
const inputPath = process.env.INPUT
const inputFileDir = path.dirname(inputPath)
const outputDir = './build/'

export default {
  input: inputPath,
  plugins: [
    require('rollup-plugin-copy')({
      targets: [{ src: inputFileDir + '/**/*', dest: `${outputDir}${inputFileDir}` }],
    }),
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-node-resolve')(),
    shouldRun && require('@rollup/plugin-run')(),
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
