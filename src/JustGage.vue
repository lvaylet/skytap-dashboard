<template>
  <div :id="_uid"></div>
</template>

<script>
import justgage from 'justgage'

export default {
  props: {
    value: Number,
    max: Number,
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    g: null
  }),

  mounted () {
    if (this.value) this.options.value = this.value
    if (this.max) this.options.max = this.max
    this.options.id = this._uid
    this.g = new JustGage(this.options)
  },

  watch: {
    value (val) {
      this.g.refresh(val)
    }
  }
}
</script>
