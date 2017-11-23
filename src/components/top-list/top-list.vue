<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :title="title"></music-list>
  </transition>
</template>
<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'

  export default {
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