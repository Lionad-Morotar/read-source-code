const PostCSS = require('postcss')

const cheerio = require('cheerio')

/**
 * 最小化 HTML
 * @param {String} htmlraw 传入未压缩的 HTML 源码
 * @returns {String} minhtml 返回压缩后的 HTML 源码
 */
module.exports = function minifier(htmlraw) {
  const $ = cheerio.load(htmlraw)

  // 去除空脚本
  $('script').replaceWith('')

  // 去除脚本回退
  $('noscript').replaceWith('')

  // 去除超链接（链接通常十分长）
  $('a').removeAttr('href')

  // 去除样式
  let style = ''
  $('style').filter(function () {
    const item = $(this)
    style += item.html()
    return true
  }).replaceWith('')

  // TODO HTML 摇树优化

  // CSS 摇树优化
  // TODO 去除空声明和其它乱七八糟的东西 ...
  const css = PostCSS.parse(style)
  css.nodes.map(node => {
    const selector = node.selector
    try {
      // 去除注释
      if (['comment'].includes(node.type)) {
        node.remove()
      }

      const matchNode = selector && $(selector)
      const matched = matchNode && matchNode.length
      !matched && node.remove()

    } catch (error) {
      const isPseudoNode = /:/.test(selector)

      // 忽略 cheerio 不能匹配伪元素的报错
      if (isPseudoNode) {
        // do nothing
        // 还可以在这里去除一些不影响样式的伪元素，不过收益甚微
      } else {
        console.log('[ERR]: ', error.message, ' | ', isPseudoNode)
      }
    }
  })

  // 重新生成样式
  let regenCSS = ''
  css.nodes.map(node => {
    regenCSS += node.toString() + '\n'
  })

  // 重新把字体样式添加到生成样式中
  // TODO 这里可能会把注释掉的字体也添加进来
  // TODO 寻找使用 postcss 处理 font-face 的方法
  const fontReMatch = style.match(/@\s*font-face\s*\{[^}]*\}/img)
  if (fontReMatch && fontReMatch.length) {
    regenCSS = fontReMatch.join('\n') + '\n' + regenCSS
  }

  $('head').append(`<style>${regenCSS}</style>`)

  return $.html()
}