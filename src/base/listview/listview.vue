<template>
  <v-scroll class="listview" :data="data" ref="listview" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="select(item)">
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
    <div class="list-fixed" v-show="listFixed" ref="fixedTop">
      <h2 class="fixed-title">{{listFixed}}</h2>
    </div>
    <div class="loading-container" v-show="!data">
      <v-loading></v-loading>
    </div>
  </v-scroll>
</template>
<script>
  import scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18  // 字体大小 + 上下 padding
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created () {
      this.touch = {}  // 定义 touch 对象，用来存储一些共用属性
      this.listHeight = []
      this.listenScroll = true
      this.probeType = 3
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 监听 scrollY 变化 根据滚动到的区间计算出索引值
      scrollY (newY) {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if ((-newY >= height1 && -newY < height2)) {
            this.currentIndex = i
            this.diff = height2 + newY  // 歌手列表高度 - 滚动的 Y 值
            /// console.log(this.diff)
            return this.currentIndex
          }
        }
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        // 减少 DOM 操作
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop

        this.$refs.fixedTop.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    computed: {
      // 生成快速入口所需数组
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      // 生成fixed title
      listFixed () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
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

        // touchmove 的偏移量除以锚点的高度 得到滚动的锚点的个数
        let detal = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + detal

        this._scrollTo(anchorIndex)
      },
      _scrollTo (index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)

        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 点击快速入口让 this.scrollY 等于左侧滚动的高度，从而通过 watch 可以监听 this.scrollY 去获取currentIndex，让对应锚点高亮
        this.scrollY = this.$refs.listview.scroll.y
      },
      // 计算每个歌手列表高度 数组
      _calculateHeight () {
        let singerList = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < singerList.length; i++) {
          let singerItem = singerList[i]
          height += singerItem.clientHeight
          this.listHeight.push(height)
        }
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      select (item) {
        this.$emit('select', item)
      },
      refresh () {
        this.$refs.listview.refresh()
      }
    },
    components: {
      'v-scroll': scroll,
      'v-loading': loading
    }
  }
</script>
<style scoped lang="stylus">
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
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>