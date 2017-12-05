<template>
  <div class="search">
    <div class="search-box-wrapper">
      <v-searchbox ref="searchBox" @query="editQuery"></v-searchbox>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <v-scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <v-searchlist :data="searchHistory" @select="addQuery" @delete="deleteItem"></v-searchlist>
          </div>
        </div>
      </v-scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <v-suggest :query="query" @listScroll="blurInput" ref="suggest" @select="saveSearch"></v-suggest>
    </div>
    <v-confirm ref="confirm" @confirm="clear" text="是否清空所有搜索历史" confirmBtnText="清空"></v-confirm>
    <router-view></router-view>
  </div>
</template>
<script>
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search.js'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {playlistMixin} from 'common/js/mixin'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import {mapGetters, mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        hotKey: [],
        query: '',
        zhida: true
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
      shortcut () {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery (query) {
        this.$refs.searchBox.setQuery(query)
      },
      editQuery (query) {
        this.query = query
      },
      // 监听 suggest 触发的 beforeScroll 事件，调用 searchBox 的 blur事件
      blurInput () {
        this.$refs.searchBox.blur()
      },
      // 当有 mini 播放存在的时候，重新设置外层容器的 bottom 并重新计算 scroll 高度
      handlePlaylist (list) {
        const bottom = list.length > 0 ? '60px' : 0

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      // 缓存搜索历史
      saveSearch () {
        this.saveSeachHistory(this.query)
      },
      // 删除当前搜索歌曲
      deleteItem (item) {
        this.deleteSearchHistory(item)
      },
      // 清空搜索列表
      clear () {
        this.clearSearchHistory()
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'saveSeachHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    watch: {
      // 当搜索了某首歌时，切换到搜素主页，DOM 发生变化，重新计算 scroll 高度
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      'v-searchbox': SearchBox,
      'v-suggest': Suggest,
      'v-searchlist': SearchList,
      'v-confirm': Confirm,
      'v-scroll': Scroll
    }
  }
</script>
<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>