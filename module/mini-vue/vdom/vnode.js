export default class VNode {
  constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
    // 节点或组件名称，如 div、svg
    this.tag = tag
    // 节点数据，如 attrs、class、style
    this.data = data
    // 子节点列表
    this.children = children
    // 文本内容
    this.text = text
    // 原生节点
    this.elm = elm
    this.ns = undefined
    // 节点（组件）的 VueJS 实例
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    // 节点（组件）数据，如 propsData、tag、children
    this.componentOptions = componentOptions
    // 组件实例（VueJS 实例）
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    // 是否是注释节点，注释节点是文本节点的一种
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }
}