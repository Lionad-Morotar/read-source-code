module.exports = function wrap({ entry, graph }) {
    const wrapper = 
`!(function (graph) {
    function require(moduleName) {
        const module = graph[moduleName]
        const { dependencies, code } = module
        const exports = {}
        !(function(require, exports){
            eval(code)
        })(
            path => require(dependencies[path]),
            exports
        )
        return exports
    }
    require(${entry})
})(${JSON.stringify(graph)})`

    return wrapper
}
