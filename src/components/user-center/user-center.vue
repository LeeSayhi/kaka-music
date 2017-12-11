<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switche-wrapper">
        <v-switches :switches="switches" :currentIndex="currentIndex" @switch="switchIndex"></v-switches>
      </div>
      <div class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <v-scroll class="list-scroll" :data="favoriteHistory" ref="favoriteList" v-if="currentIndex === 0">
          <div class="list-inner">
            <v-songList :songs="favoriteHistory" @select="selectitem"></v-songList>
          </div>
        </v-scroll>
        <v-scroll class="list-scroll" :data="playHistory" ref="playList" v-if="currentIndex === 1">
          <div class="list-inner">
            <v-songList :songs="playHistory"></v-songList>
          </div>
        </v-scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <v-noResult :title="noResutlDesc"></v-noResult>
      </div>
    </div>
  </transition>
</template>
<script>
  import Switches from 'base/switches/switches'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/no-result/no-result'
  import {mapGetters, mapActions} from 'vuex'
  import {Song} from 'common/js/song'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'favoriteHistory',
        'playHistory'
      ]),
      noResult () {
        if (this.currentIndex === 0) {
          return !this.favoriteHistory.length
        } else {
          return !this.playHistory.length
        }
      },
      noResutlDesc () {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      switchIndex (index) {
        this.currentIndex = index
      },
      selectitem (item) {
        this.insertSong(new Song(item))
      },
      handlePlaylist (list) {
        const bottom = list.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      'v-switches': Switches,
      'v-songList': SongList,
      'v-scroll': Scroll,
      'v-noResult': NoResult
    }
  }
</script>
<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switche-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
</style>