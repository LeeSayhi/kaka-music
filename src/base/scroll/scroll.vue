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
      },
      probeType: {
        type: Number,
        default: 1
      },
      listenScroll: {
        type: Boolean,
        default: true
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
          probeType: this.probeType
        })

        if (this.listenScroll) {
          let _this = this
          this.scroll.on('scroll', (pos) => {
            _this.$emit('scroll', pos)
          })
        }
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)   // 因为在父组件组件中调用此方法时上下文不是 this.scroll，所以用 apply 改变上下文 参数传入 this.scroll
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      }
    }
  }
</script>
<style lang="stylus">
  
</style>