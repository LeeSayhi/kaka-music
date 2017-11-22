<template>
  <v-musicList :bgImage="bgImage" :title="title"></v-musicList>
</template>
<script>
  import Musiclist from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'

  export default {
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
    components: {
      'v-musicList': Musiclist
    }
  }
</script>
<style lang="stylus">
  
</style>