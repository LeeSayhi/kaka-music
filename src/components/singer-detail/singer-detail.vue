<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage" :songs="songs" @playMode="playModeAll"></music-list>
	</transition>
</template>
<script>
	import {mapGetters, mapActions} from 'vuex'

	import {getSingerDetail} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'

	import musicList from 'components/music-list/music-list'

	export default {
		computed: {
			...mapGetters([
				'singer'
			]),
			title () {
				return this.singer.name
			},
			bgImage () {
				return this.singer.avatar
			}
		},
		data () {
			return {
				songs: []
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
          }
				})
			},
			// 初始化QQ音乐歌手的歌曲数据
	    _normalizeSongs (list) {
	      let ret = []
	      list.forEach((item) => {
	        let {musicData} = item
	        if (musicData.songid && musicData.albummid) {
	          ret.push(createSong(musicData))
	        }
	      })
	      return ret
	    },
	    // 随机播放
	    playModeAll () {
	    	this.randomPlay(this.songs)
	    },
	    ...mapActions([
	    	'randomPlay'
	    ])
		},
		components: {
			'music-list': musicList
		}
	}
</script>
<style scoped lang="stylus">
	@import "~common/stylus/variable"

	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
</style>