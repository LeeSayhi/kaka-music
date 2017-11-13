<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <v-scroll class="list" :data="songs" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </v-scroll>
  </div>
</template>
<script>
  import songList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'

  const TITLE_HEIGHT = 40

  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted () {
      this.imgHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imgHeight + TITLE_HEIGHT

      this.$refs.list.$el.style.top = `${this.imgHeight}px`
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.push('/singer')
      }
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        const percent = Math.abs(newY / this.imgHeight)

        this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`

        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        }

        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style.transform = `scale(${scale})`
      }
    },
    components: {
      'song-list': songList,
      'v-scroll': Scroll
    }
  }
</script>
<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
  .music-list
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 100
    overflow: hidden
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      width: 80%
      z-index: 40
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
    .song-list-wrapper
      padding: 20px 30px
</style>