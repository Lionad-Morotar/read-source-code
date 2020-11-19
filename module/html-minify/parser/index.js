const fs = require('fs')
const path = require('path')

const minifier = require('./minifier')

const rawDir = path.join(__dirname, '../raw')

fs.readdirSync(rawDir).map((filename, idx) => {
  const isHTML = filename.endsWith('.html')
  if (isHTML) {
    const idxLable = `[${idx.toString().padStart(3, '0')}]`

    const filePath = path.join(rawDir, filename)
    const template = fs.readFileSync(filePath)

    const minhtml = minifier(template)
    console.log(`${idxLable} reduced to: `, (minhtml.length / template.length * 100).toFixed(2) + '%')

    fs.writeFileSync(path.join(__dirname, `../dist/${filename}`), minhtml)
  }
})