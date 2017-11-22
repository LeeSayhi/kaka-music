<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
<!--       <div class="play">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div> -->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <v-scroll class="list" :data="songs" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectSong"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <v-loading></v-loading>
      </div>
    </v-scroll>
  </div>
</template>
<script>
  import songList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import {prefixStyle} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const TITLE_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdropFilter = prefixStyle('backdrop-filter')

  export default {
    mixins: [playlistMixin],
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
      // 歌手图片
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted () {
      this.imgHeight = this.$refs.bgImage.clientHeight   // 图片的高度
      this.minTranslateY = -this.imgHeight + TITLE_HEIGHT  // 滚动的最小 Y 值

      // 初始化歌曲列表的 top 值
      this.$refs.list.$el.style.top = `${this.imgHeight}px`
    },
    created () {
      // BScroll 所需参数
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      back () {
        this.$router.back()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      selectSong (item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions([
        'selectPlay'
      ]),
      handlePlaylist (playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      }
    },
    watch: {
      // 监听 scrollY 变化，去改变图片的高度大小等。
      scrollY (newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        const percent = Math.abs(newY / this.imgHeight)  // 滚动距离与图片大小的比例

        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdropFilter] = `blur(${blur}px)`

        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    components: {
      'song-list': songList,
      'v-scroll': Scroll,
      'v-loading': Loading
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
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>