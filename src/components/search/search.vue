<template>
  <div class="search">
    <div class="search-box-wrapper">
      <v-searchbox ref="searchBox" @query="editQuery"></v-searchbox>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <v-suggest :query="query" @listScroll="blurInput"></v-suggest>
    </div>
  </div>
</template>
<script>
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search.js'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'

  export default {
    data () {
      return {
        hotKey: [],
        query: '',
        zhida: true
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
      }
    },
    components: {
      'v-searchbox': SearchBox,
      'v-suggest': Suggest
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