<template>
  <transition name="slide">
    <v-musicList :bgImage="bgImage" :title="title" :songs="songs"></v-musicList>
  </transition>
</template>
<script>
  import Musiclist from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createDiscSong} from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'disc'
      ]),
      bgImage () {
        return this.disc.imgurl
      },
      title () {
        return this.disc.dissname
      }
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        const num = 15
        getSongList(this.disc.dissid, num).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSinger(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSinger (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.id && musicData.mid) {
            ret.push(createDiscSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      'v-musicList': Musiclist
    }
  }
</script>
<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>