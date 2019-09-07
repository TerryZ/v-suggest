import dropdown from 'v-dropdown'

export default {
  components: { dropdown },
  props: {
    data: Array,
    value: String,
    name: String,
    keyField: {
      type: String,
      default: 'id'
    },
    showField: {
      type: [String, Function],
      default: 'name'
    },
    placeholder: String,
    delay: {
      type: Number,
      default: 0.1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      text: typeof this.value === 'undefined' ? '' : this.value,
      list: [],
      highlight: -1,
      width: 0,
      show: false,
      last: null,
      lastInputTime: -1
    }
  },
  watch: {
    value (val) {
      this.text = val
    },
    text (val) {
      this.$emit('input', val)
    }
  }
}
