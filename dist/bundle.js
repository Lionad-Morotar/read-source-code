!(function (graph) {
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
    require(./src/index.js)
})({"./src/index.js":{"code":"\"use strict\";\n\nvar _person = _interopRequireDefault(require(\"./person.js\"));\n\nvar _message = _interopRequireDefault(require(\"./data/message.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n_person[\"default\"].say(_message[\"default\"]);","dependencies":{"./person.js":"./src\\person.js","./data/message.js":"./src\\data\\message.js"}},"./src\\person.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _say = _interopRequireDefault(require(\"./method/say.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar _default = {\n  say: _say[\"default\"]\n};\nexports[\"default\"] = _default;","dependencies":{"./method/say.js":"./src\\method\\say.js"}},"./src\\data\\message.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = 'hello world';\nexports[\"default\"] = _default;","dependencies":{}},"./src\\method\\say.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = say;\n\nfunction say(hi) {\n  console.log(hi);\n}","dependencies":{}}})