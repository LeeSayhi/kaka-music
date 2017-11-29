<template>
  <div class="singer" ref="singer">
    <listview :data="singerList" @select="selectSinger" ref="listview"></listview>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getSingerList} from 'api/singer'
  import listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LENGTH = 10

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        singerList: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          this.singerList = this._normalizeSinger(res.data.list)
        })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          // 前十条选为热门。push 进 map
          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push({
              name: item.Fsinger_name,
              id: item.Fsinger_mid,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          // 再将字母及对应歌手信息 push 进 map
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          // 歌手信息
          map[key].items.push({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        })
        // 最终得到 map: {hot:{title:'热门', items:[]}, A:{title:'A', items:[]}}
        // 最后将 map 对象 处理为有序数组（按照 A -> Z 排序）
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // a,b表示数组中的任意两个元素，若return > 0 b前a后；reutrn < 0 a前b后（a-b输出从小到大排序，b-a输出从大到小排序）
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.listview.refresh()
      }
    },
    components: {
      listview
    }
  }
</script>
<style scoped lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>