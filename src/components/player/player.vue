<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart="lyricTouchStart"
             @touchmove="lyricTouchMove"
             @touchend="lyricTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapepr" ref="cdWrapper">
              <div class="cd" :class="adCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <v-scroll class="middle-r" :data="currentLyricLines && currentLyricLines" ref="lyricList">
            <div class="lyric-wrapper">
                <div>
                  <p 
                      class="text" 
                      :class="{'current': currentLineNum === index}"
                      v-for="(line, index) in currentLyricLines"
                      ref="lyricLine"
                  >{{line.txt}}</p>
                </div>
            </div>
          </v-scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i :class="modeIcon" @click="toggleMode"></i>
            </div>
            <div class="icon icon-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon icon-center">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon icon-right" @click.stop="toggleFavorite(currentSong)">
              <i :class="favoriteMode(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" :class="adCls">
          <img :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
        	<progress-circle :percent="percent">
	        	<i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
	        </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist">
          </i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio :src="currentSong.url" ref="audio" @play="play" @error="error" @timeupdate="timeupdate" @ended="ended"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Scroll from 'base/scroll/scroll'
  import Lyric from 'lyric-parser'
  import Playlist from 'components/play-list/play-list'
  import {Song} from 'common/js/song'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
  	data () {
  		return {
  			songReady: false,  // audio 的 canpaly 事件的标识
        currentTime: 0,
        currentLyric: null,
        currentLyricLines: [],
        currentLineNum: 0,
        playingLyric: '',
        currentShow: 'cd'
  		}
  	},
    created () {
      this.touch = {}
    },
    computed: {
      ...mapGetters([
        'playList',
        'fullScreen',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList',
        'favoriteHistory'
      ]),
      // 播放时间的进度比
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      // 全屏 播放 || 暂停 按钮样式切换
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      // mini 播放 || 暂停 按钮样式切换
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 专辑图片 动画与暂停的 class
      adCls () {
        return this.playing ? 'play' : 'play pause'
      },
      // 播放模式 按钮样式切换
      modeIcon () {
        return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAY_LIST'
      }),
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      // 计算出 normal -> mini 的偏移量以及比例
      _getPosAndScale () {
        const targetWidth = 40 // mini
        const paddingLeft = 40 // mini
        const paddingBottom = 30  // mini
        const paddingTop = 80  // normal
        const width = window.innerWidth * 0.8   // normal

        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)  // x 偏移
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom  // y 偏移

        return {
          x,
          y,
          scale
        }
      },
      /* 进入 */
      enter (el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 600,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      /* 离开 */
      leave (el, done) {
        const {x, y, scale} = this._getPosAndScale()

        this.$refs.cdWrapper.style.transition = 'all 0.6s'
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      // 修改 playing 值 （控制播放 || 暂停）
      togglePlaying () {
        this.setPlaying(!this.playing)

        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      // 下一首
      nextSong () {
      	if (!this.songReady) {
      		return
      	}

        if (this.playList.length === 1) {
          this.loop()
        }

        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)

        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      // 上一首
      prevSong () {
      	if (!this.songReady) {
      		return
      	}
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)

        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      toggleFavorite (song) {
        if (this.isFavorite(song)) {
          this.deleteFavoriteHistory(song)
        } else {
          this.saveFavoriteHistory(song)
        }
      },
      favoriteMode (song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      isFavorite (song) {
        const index = this.favoriteHistory.findIndex((item) => {
          return song.id === item.id
        })
        return index > -1
      },
      // 当歌曲可以播放的时候（移动端浏览器监听不到 audio 的 canPlay ？？）
      play () {
      	setTimeout(() => {
          this.songReady = true
        }, 500)
        this.savePlayHistory(this.currentSong)
      },
      // 当歌曲加载失败的时候
      error () {
      	this.songReady = true
      },
      ended () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.nextSong()
        }
      },
      // 单曲循环
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()

        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 当前播放的时间（时间戳）
      timeupdate (e) {
        this.currentTime = e.target.currentTime
      },
      // 时间戳转换成 分秒形式
      formatTime (interval) {
        interval = interval | 0
        let minute = interval / 60 | 0
        let second = interval % 60
        return `${this._pad(minute)}:${this._pad(second)}`
      },
      // 时间转换成 00:00 形式
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      // 根据拖动距离的比例来计算播放的时间进度
      percentChange (percent) {
      	const currentTime = this.currentSong.duration * percent
      	this.$refs.audio.currentTime = currentTime

      	if (!this.playing) {
      		this.togglePlaying()
      	}

        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 切换播放模式
      toggleMode () {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)

        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }

        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      // 顺序列表里的歌曲对应到随机列表里是哪首歌，并返回它的索引
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })

        this.setCurrentIndex(index)
      },
      // 获取并解析歌词
      getLyric () {
        new Song(this.currentSong).getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          this.currentLyricLines = this.currentLyric.lines

          if (this.playing) {
            this.currentLyric.play()
          }
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum

        // 歌词位置行数 > 5 总是居中
        if (lineNum > 5) {
          let centerEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(centerEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },

      /* 切换所有歌词的显示页面 */
      lyricTouchStart (e) {
        this.touch.init = true
        // 用来判断是不是一次移动
        this.touch.moved = false
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
       },
      lyricTouchMove (e) {
        const deltaX = e.touches[0].pageX - this.touch.startX
        const deltaY = e.touches[0].pageY - this.touch.startY
        // 如果是纵向滚动就 return
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }

        if (!this.touch.moved) {
          this.touch.moved = true
        }

        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltaX + left))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      lyricTouchEnd () {
        let offsetWidth
        let time = 300
        let opacity // CD 的透明度

        // 移动距离 > 屏幕的 10% 就 全部移过来
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth

            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0

            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }

        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.init = false
      },
      showPlayList () {
        this.$refs.playList.show()
      },
      ...mapActions([
        'saveFavoriteHistory',
        'deleteFavoriteHistory',
        'savePlayHistory'
      ])
    },
    watch: {
      // 监听歌曲改变， 播放歌曲
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (!newSong.id) {
          return
        }
        setTimeout(() => {
          this.getLyric()
          this.$refs.audio.play()
        }, 1000)

        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.currentLineNum = 0
        }
      },
      // 监听 playing，播放 || 暂停
      playing (newPlaying) {
        let audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      'progress-bar': ProgressBar,
      'progress-circle': ProgressCircle,
      'v-scroll': Scroll,
      'play-list': Playlist
    }
  }
</script>
<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .player
    .normal-player
      position: fixed
      top: 0
      right: 0
      bottom: 0
      left: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 28px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text        
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        .middle-l
          position: relative
          display: inline-block
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapepr
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-midium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-1
              font-size: $font-size-medium
              &.current
                color: $color-theme
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              tex-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            i
              font-size: 30px
          .icon-left
            text-align: right
          .icon-center
            text-align: center
            padding: 0 20px
            i
              font-size: 40px
          .icon-right
            text-align: left
            .icon-favorite
              color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.6s
        .top, .bottom
          transition: all 0.6s cubic-bezier(0.86, 0.18, 0.82, 1.32)         
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.6s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          top: 0
          left: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>