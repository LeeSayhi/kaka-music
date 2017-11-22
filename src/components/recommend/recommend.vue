<template>
  <div class="recommend" ref="recommend">
    <v-scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <v-slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </v-slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="title" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>      
      </div>
      <div class="loading-container" v-show="!discList.length">
        <v-loading></v-loading>
      </div>
    </v-scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config/'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        recommends: [],
        discList: []
      }
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      // 轮播图数据
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      // 推荐列表数据
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      // mini 播放器时 重新计算 scroll 高度
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      // 跳转路由并提交数据
      selectItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      'v-slider': Slider,
      'v-scroll': Scroll,
      'v-loading': Loading
    }
  }
</script>
<style lang="stylus">
  @import "~common/stylus/variable"
  
  .recommend
    position: fixed
    top: 88px
    width: 100%
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            width: 60px
            flex: 0 0 60px
            padding-right: 20px
          .text
            display: flex
            flex: 1
            flex-direction: column
            justify-content: center
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .title
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>