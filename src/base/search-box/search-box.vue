<template>
  <div class="search_box">
    <i class="icon-search"></i>
    <input class="box" ref="query" v-model="query" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>
<script>
  import {debounce} from 'common/js/util'

  export default {
    data () {
      return {
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    created () {
      // 事件节流，300ms 触发一次
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 300))
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        this.query = query
      },
      // 输入框失去焦点（移动端会收起键盘）
      blur () {
        this.$refs.query.blur()
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import '~common/stylus/variable'
  
  .search_box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-middle
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>