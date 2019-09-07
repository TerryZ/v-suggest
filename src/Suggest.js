import './suggest.scss'

import data from './mixins/data'
import methods from './mixins/methods'
import render from './mixins/render'

export default {
  name: 'v-suggest',
  mixins: [data, methods, render]
}
