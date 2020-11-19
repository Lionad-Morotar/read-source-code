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

  // CSS 摇树优化
  // TODO 去除空声明 and more ...
  const css = PostCSS.parse(style)
  css.nodes.map(rule => {
    // console.log(rule.selector)

    try {
      const selector = rule.selector
      const matchNode = selector && $(selector)
      const matched = matchNode && matchNode.length

      if (!matched) {
        rule.remove()
      }
    } catch (error) {
      // rule.remove()
    }
  })

  // 重新生成样式
  let regenCSS = ''
  css.nodes.map(rule => {
    regenCSS += rule.toString() + '\n'
  })
  $('head').append(`<style>${regenCSS}</style>`)

  return $.html()
}