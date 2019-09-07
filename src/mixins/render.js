export default {
  render (h) {
    return h('dropdown', {
      props: {
        disabled: this.disabled,
        border: false,
        manual: true
      },
      on: {
        show: this.showChange
      },
      ref: 'drop'
    }, [
      this.buildCaller(h),
      this.buildResult(h)
    ])
  },
  methods: {
    /**
     * the input(result list trigger)
     *
     * @param {createElement} h
     * @returns
     */
    buildCaller (h) {
      const child = []
      const option = {
        attrs: {
          type: 'text',
          placeholder: this.placeholder,
          disabled: this.disabled
        },
        domProps: {
          value: this.text.trim()
        },
        on: {
          keyup: this.processKey,
          keydown: this.processControl,
          focus: this.open,
          input: e => {
            this.text = e.target.value.trim()
          }
        },
        ref: 'input'
      }
      if (this.name) option.attrs.name = this.name
      child.push(h('input', option))
      // clean button
      if (!this.disabled) {
        child.push(h('div', {
          class: 'sg-clear',
          on: {
            click: this.clear
          },
          directives: [{
            name: 'show',
            value: this.text
          }]
        }, [h('span', '×')]))
      }
      return h('template', { slot: 'caller' }, [
        h('div', { class: 'v-suggest' }, child)
      ])
    },
    /**
     * the suggestion result list
     *
     * @param {createElement} h
     * @returns
     */
    buildResult (h) {
      return h('ul', {
        class: 'sg-results',
        style: {
          width: this.width + 'px'
        },
        ref: 'list'
      }, this.list.map((row, index) => {
        const child = []
        const options = {
          class: {
            'sg-results__row': true,
            'sg-over': this.highlight === index
          },
          on: {
            click: () => {
              this.selectItem(row)
            },
            mouseenter: () => {
              this.highlight = index
            },
            mouseleave: () => {
              this.highlight = -1
            }
          }
        }
        // scoped slot supports
        if ('default' in this.$scopedSlots) {
          child.push(this.$scopedSlots.default({
            row: row
          }))
        } else {
          options.domProps = {
            innerHTML: this.getRow(row)
          }
        }
        return h('li', options, child)
      }))
    }
  }
}
