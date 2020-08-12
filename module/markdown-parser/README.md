# Markdown Paaz

A simple markdown parzer which supports plugins.

## Demo Page

Demo Page：

![Mardown Paaz Demo Page](./assets/demo.gif)

## Refactor

去年读 VueJS 的 HTML Parser 的时候，仿照着写了一个 Markdown 解析器，叫做 TEditor。TEditor 维护了一个解析状态栈。逐个读入字符，结合当前解析状态进行状态转换，将旧状态推入栈中，以模仿解析 HTML 的层级结构。状态栈的入栈、出栈过程，通过 DIG_IN、DIG_OUT 来维护，这两个函数会触发更新标签流的副作用。

因为处理整段字符也只需要一次循环；要维护的状态大体上来说只有零散的几个变量和一个状态栈；没有用正则匹配；再加上每解析过程和正常的 Markdown 解析器不一样，TEditor 最大段落只支持到行，再加上每行都做了 LFU 缓存。所以理论上来说 TEditor 应该相当快... 不过，随着解析器的功能增强，状态维护变得有点困难，特别乱。反正我现在是很难看懂我以前写了啥玩意儿...

经过一年的 JS 学习，我的 JS 水平提高了不少。近期我重写了这个 Markdown 解析器，舍弃了“状态转换”的概念，用回了正则匹配 + AST。虽然说速度可能变慢了一个量级，不过可扩展性还是非常强的，比如说可自定义解析插件，介入解析过程。有空还是得学习 Markdown-It 的源码，那玩意儿是我的目标...

[阅读更多](https://mgear-blogs.obs-website.cn-east-3.myhuaweicloud.com/articles/fold/2019-6/a-markdown-parser.html)