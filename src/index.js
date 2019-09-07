import Suggest from './Suggest'

const Plugin = {
  install (Vue, options = {}) {
    if (Object.keys(options).length) {
      if (typeof options.placeholder === 'string') Suggest.props.placeholder.default = options.placeholder
    }

    Vue.component(Suggest.name, Suggest)
  }
}

export { Suggest }

export default Plugin
