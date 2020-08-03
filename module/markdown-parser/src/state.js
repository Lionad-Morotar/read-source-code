const stateManipulate = {
  init() {
    Object.keys(this).map(k => this[k] && this[k].init && this[k].init())
    return this
  },
  has(prop) {
    return !!this[prop].value
  },
  get(prop) {
    return this[prop].value
  },
  set(prop, value) {
    this[prop].value = value
    return this
  },
}

function create(rest) {
  const state = Object.create(stateManipulate)

  /** props */

  state.raw = {
    value: rest,
  }

  state.rest = {
    init() {
      this.value = null
    },
  }

  state.idx = {
    init() {
      this.value = 0
    },
  }

  state.isInline = {
    init() {
      this.value = []
    },
  }

  state.init()
  state.set('rest', rest)

  return state
}

export default {
  create,
}
