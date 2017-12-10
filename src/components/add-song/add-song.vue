<template>
  <transition name="fade">
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <h1 class="text">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <v-searchbox placeholder="搜索歌曲" @query="editQuery" ref="searchBox"></v-searchbox>
      </div>
      <div class="short-cut" v-show="!query">
        <v-switches :switches="switches" @switch="selectSwitch" :currentIndex="switchIndex"></v-switches>
        <div class="list-wrapper">
          <v-scroll ref="songList" :data="playHistory" class="list-scroll" v-if="switchIndex === 0">
            <div class="list-inner">
              <v-songList :songs="playHistory" @select="selectItem"></v-songList>
            </div>
          </v-scroll>
          <div class="list-scroll" v-if="switchIndex === 1">
            <div class="list-inner">
              <v-searchList ref="searchList" :data="searchHistory" @select="addQuery"></v-searchList>
            </div>
          </div>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <v-suggest :query="query" :showSinger="showSinger" @listScroll="blurInput" @select="saveSearch" ref="suggest"></v-suggest>
      </div>
      <v-topTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">你已成功添加一首歌曲到播放列表</span>
        </div>
      </v-topTip>
    </div>
  </transition>
</template>
<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import Switches from 'base/switches/switches'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import SearchList from 'base/search-list/search-list'
  import TopTip from 'base/top-tip/top-tip'
  import {mapActions, mapGetters} from 'vuex'
  import {Song} from 'common/js/song'

  export default {
    data () {
      return {
        showFlag: false,
        showSinger: false,
        query: '',
        songs: [],
        switchIndex: 0,
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
    methods: {
      show () {
        this.showFlag = true
        this.$nextTick(() => {
          if (this.switchIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
        this.$emit('closeAddSong')
      },
      editQuery (query) {
        this.query = query
      },
      blurInput () {
        this.$refs.searchBox.blur()
      },
      saveSearch () {
        this.$refs.topTip.show()
        this.saveSearchHistory(this.query)
      },
      // switches 组件的 TAB 切换
      selectSwitch (index) {
        this.switchIndex = index
      },
      // 添加最近播放歌曲到播放列表
      selectItem (song) {
        const index = this.playHistory.findIndex((item) => {
          return item.id === song.id
        })
        if (index === 0) {
          return
        }
        this.$refs.topTip.show()
        this.insertSong(new Song(song))
      },
      // 点击搜索历史进行搜索
      addQuery (query) {
        this.$refs.searchBox.setQuery(query)
      },
      ...mapActions([
        'saveSearchHistory',
        'insertSong'
      ])
    },
    components: {
      'v-searchbox': SearchBox,
      'v-suggest': Suggest,
      'v-switches': Switches,
      'v-songList': SongList,
      'v-scroll': Scroll,
      'v-searchList': SearchList,
      'v-topTip': TopTip
    }
  }
</script>
<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  
  .add-song
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 200
    background: $color-background
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.3s
    &.fade-enter, &.fade-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .text
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .short-cut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>