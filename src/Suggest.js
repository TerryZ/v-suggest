import './suggest.scss'

import data from './mixins/data'
import methods from './mixins/methods'
import render from './mixins/render'
import watch from './mixins/watch'

export default {
  name: 'v-suggest',
  mixins: [data, methods, render, watch]
}
