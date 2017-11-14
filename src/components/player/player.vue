<template>
  <div class="player" v-show="playList.length > 0">
    <div class="normal-player" v-show="fullScreen">

    </div>
    <div class="mini-player" v-show="!fullScreen">
      
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'playList',
        'fullScreen',
        'sequenceList',
        'currentIndex',
        'playing'
      ])
    }
  }
</script>
<style lang="stylus">
  @import '~common/stylus/variable.styl'

  .player
    .normal-player
      position: fixed
      top: 0
      right: 0
      bottom: 0
      left: 0
      overflow: hidden
      background: $color-background
</style>