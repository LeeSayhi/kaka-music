<template>
	<div class="singer-detail">nnn</div>
</template>
<script>
	import {mapGetters} from 'vuex'

	import {getSingerDetail} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'

	export default {
		computed: {
			...mapGetters([
				'singer'
			])
		},
		data () {
			return {
				song: []
			}
		},
		created () {
			this._getSingerDetail()
		},
		methods: {
			_getSingerDetail () {
				if (!this.singer.id) {
					this.$router.push('/singer')
					return
				}
				getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
				})
			},
	    _normalizeSongs (list) {
	      let ret = []
	      list.forEach((item) => {
	        let {musicData} = item
	        if (musicData.songid && musicData.albummid) {
	          ret.push(createSong(musicData))
	        }
	      })
	      return ret
	    }
		}
	}
</script>
<style lang="stylus">
	@import "~common/stylus/variable"

	.singer-detail
		position: fixed
		top: 0
		right: 0
		bottom: 0
		left: 0
		z-index: 100
		background: $color-background
</style>