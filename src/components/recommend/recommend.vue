<template>
  <div class="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper">
      <v-slider>
        <div v-for="item in recommends" class="slider-item">
          <a :href="item.linkUrl">
            <img :src="item.picUrl">
          </a>
        </div>
      </v-slider>      
      </div>      
    </div>
  </div>
</template>
<script>
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config/'

  import Slider from 'base/slider/slider'

  export default {
    data () {
      return {
        recommends: []
      }
    },
    created () {
      this._getRecommend()
    },
    methods: {
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            console.log(this.recommends)
          }
        })
      }
    },
    components: {
      'v-slider': Slider
    }
  }
</script>
<style lang="stylus">
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
</style>