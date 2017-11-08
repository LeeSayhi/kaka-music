<template>
  <scroll class="listview" :data="data" ref="listview" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group  list-group-hook" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onshortcuttouchstart" @touchmove.stop.prevent="onshortcuttouchmove">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li>
      </ul>
    </div>   
  </scroll>
</template>
<script>
  import scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18  // 字体大小 + 上下 padding

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created () {
      this.touch = {}  // 定义 touch 对象,，用来存储一些共用属性
      this.listHeight = []
      this.listenScroll = true
      this.probeType = 3
    },
    data () {
      return {
        scrollY: 0
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      }
    },
    computed: {
      // 生成快速入口所需数组
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      }
    },
    methods: {
      // touch 联动
      onshortcuttouchstart (e) {
        let anchorIndex = getData(e.target, 'index')
        this._scrollTo(anchorIndex)

        this.touch.y1 = e.touches[0].pageY  // 被 touch 对象的 Y 坐标

        this.touch.anchorIndex = anchorIndex
      },
      // 滚动联动
      onshortcuttouchmove (e) {
        this.touch.y2 = e.touches[0].pageY  // touchmove 时的 Y 坐标
        // console.log(this.touch.y1, this.touch.y2)
        let detal = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0   // touchmove 的偏移量
        let anchorIndex = parseInt(this.touch.anchorIndex) + detal

        this._scrollTo(anchorIndex)
      },
      _scrollTo (index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 歌手列表高度 数组
      _calculateHeight () {
        let singerList = document.getElementsByClassName('list-group-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < singerList.length; i++) {
          let singerItem = singerList[i]
          height += singerItem.clientHeight
          this.listHeight.push(height)
        }
      },
      scroll (pos) {
        this.scrollY = Math.abs(Math.round(pos.y))
      }
    },
    components: {
      scroll
    }
  }
</script>
<style lang="stylus">
  @import '~common/stylus/variable.styl'

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium          
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
</style>