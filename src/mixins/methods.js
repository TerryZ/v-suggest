const [UP, DOWN, ESC, TAB, ENTER] = [38, 40, 27, 9, 13]
const rect = el => el && Object.keys(el).length
  ? el.getBoundingClientRect()
  : null

export default {
  methods: {
    focus () {
      if (this.text.trim()) {
        this.checkIfOpen(this.populate())
      } else {
        this.checkIfOpen(this.defaultList())
      }
    },
    /**
     * Open dropdown layer
     */
    open () {
      if (!this.show) this.$refs.drop.visible()
      this.adjust()
    },
    /**
     * Close dropdown layer
     *
     * @param {function} aftercare - do some stuff after dropdown closed
     */
    close (aftercare) {
      if (this.show) this.$refs.drop.visible()
      this.reset()

      if (typeof aftercare === 'function') {
        window.setTimeout(aftercare, 150)
      }
    },
    adjust () {
      if (!this.$refs.input || this.width > 0) return

      const width = rect(this.$refs.input).width
      const MIN_WIDTH = 200
      this.width = width > MIN_WIDTH ? width : MIN_WIDTH
    },
    clear () {
      this.text = ''
      this.$emit('clear')
      this.$refs.input.focus()
    },
    reset () {
      this.highlight = -1
    },
    getRow (row) {
      switch (typeof this.showField) {
        case 'string': return row[this.showField] ? row[this.showField] : ''
        case 'function': return this.showField(row) ? this.showField(row) : ''
      }
    },
    showChange (val) {
      this.show = val
      if (val) {
        this.$nextTick(() => {
          this.$refs.drop.adjust()
        })
      } else {
        this.reset()
      }
    },
    selectItem (row) {
      this.text = this.getRow(row)
      this.$emit('values', row)
      this.close()
    },
    populate () {
      const text = this.text.trim().toLowerCase()
      if (!this.data.length || !text) return []
      const list = this.data.filter(value => {
        const result = this.getRow(value).toLowerCase()
        return new RegExp(text).test(String(result))
      })
      return this.listed(list)
    },
    /**
     * The default list without search
     */
    defaultList () {
      return this.fullList ? this.listed() : []
    },
    listed (list) {
      if (!list) list = this.data
      return this.maxLength
        ? list.filter((val, index) => index < this.maxLength)
        : list
    },
    checkIfOpen (list) {
      if (list && list.length) {
        this.list = list
        this.open()
      } else {
        this.close(() => {
          if (this.list.length) this.list = []
        })
      }
    },
    search (e) {
      this.lastInputTime = e.timeStamp
      setTimeout(() => {
        if ((e.timeStamp - this.lastInputTime) === 0) {
          this.checkIfOpen(this.populate())
        }
      }, this.delay * 1000)
    },
    processControl (e) {
      if (![UP, DOWN, ESC, ENTER, TAB].includes(e.keyCode) || !this.list.length) return
      switch (e.keyCode) {
        case UP:// up
          this.previous()
          break
        case DOWN:// down
          this.next()
          break
        case TAB: // tab
        case ENTER:// enter
          if (this.highlight !== -1) this.selectItem(this.list[this.highlight])
          break
        case ESC:// escape
          this.close()
          break
      }
    },
    next () {
      if (!this.show) this.open()
      if (this.highlight < (this.list.length - 1)) {
        this.highlight++
        this.$nextTick(() => {
          const list = this.$refs.list
          const curPos = rect(list.querySelectorAll('.sg-over')[0])
          const listPos = rect(list)
          const dist = (list.scrollTop + curPos.bottom) - listPos.bottom
          if (dist) list.scrollTop = dist
        })
      }
    },
    previous () {
      if (this.highlight === 0) return
      if (!this.show) this.open()
      this.highlight = this.highlight === -1 ? this.list.length - 1 : --this.highlight
      this.$nextTick(() => {
        const list = this.$refs.list
        const curPos = rect(list.querySelectorAll('.sg-over')[0])
        const listPos = rect(list)
        const dist = curPos.top - listPos.top
        if (dist < 0) list.scrollTop += dist
      })
    }
  }
}
