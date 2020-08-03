const path = require('path')

const inputPath = process.env.INPUT
const inputFileDir = path.dirname(inputPath)

console.log(inputPath, inputFileDir)

export default {
  input: inputPath,
  plugins: [
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-node-resolve')(),
    require('@rollup/plugin-run')(),
  ],
  external: [/node_modules/],
  output: {
    name: 'flowchart',
    file: `./build/${inputPath}`,
    format: 'umd',
    sourcemap: true,
  },
  watch: {
    include: inputFileDir + '/**/*.js',
  },
}
