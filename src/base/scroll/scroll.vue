<template>
  <div ref="wrapper">
     <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    props: {
      data: {
        type: Array,
        dafault: null
      },
      click: {
        type: Boolean,
        dafault: true
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    watch: {
      data () {
        setTimeout(() => {
          this.scroll.refresh()
        }, 20)
      }
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          probeType: 3
        })
        this.scroll.on('scroll', (pos) => {
          this.$emit('scrollY', pos.y)
        })
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>
<style lang="stylus">
  
</style>