<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :title="title" :songs="rankSongs"></music-list>
  </transition>
</template>
<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data () {
      return {
        rankSongs: []
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      bgImage () {
        return this.topList.picUrl
      },
      title () {
        return this.topList.topTitle
      }
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getSongList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.rankSongs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          if (item.data.songid && item.data.songmid) {
            ret.push(createSong(item.data))
          }
        })
        return ret
      }
    },
    components: {
      'music-list': MusicList
    }
  }
</script>
<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>