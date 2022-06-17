const registerTypes = ['filter']

export function initGlobalAPI (Vue) {

  Vue.options = Vue.options || {}
  registerTypes.map(type => {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return Vue.options[name][id]
      }
      const name = `${type}s`
      Vue.options[name] = Vue.options[name] || {}
      Vue.options[name][id] = definition
      return Vue
    }
  })
}