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
      default: 0.2
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 0
    },
    fullList: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      text: typeof this.value === 'undefined' ? '' : this.value,
      list: [],
      highlight: -1,
      width: 0,
      show: false,
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
