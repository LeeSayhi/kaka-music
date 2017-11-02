<template>
  <div class="recommend">recommend</div>
</template>
<script>
  import {getRecommend} from 'api/recommend'

  export default {
    data () {
      return {
        recommends: []
      }
    },
    created () {
      getRecommend.then((res) => {
        if (res.code === 0) {
          this.recommends = res.data.slider
          console.log(this.recommends)
        }
      })
    }
  }
</script>
<style lang="stylus">
  
</style>