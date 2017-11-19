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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapepr" ref="cdWrapper">
              <div class="cd" :class="adCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot active"></span>
            <span class="dot"></span>
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
            <div class="icon icon-right">
              <i class="icon-not-favorite"></i>
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
        <div class="control"></div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @play="play" @error="error" @timeupdate="timeupdate" @ended="ended"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'

  const transform = prefixStyle('transform')

  export default {
  	data () {
  		return {
  			songReady: false,  // audio 的 canpaly 事件的标识
        currentTime: 0
  		}
  	},
    computed: {
      ...mapGetters([
        'playList',
        'fullScreen',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
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
      },
      // 下一首
      nextSong () {
      	if (!this.songReady) {
      		return
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
      // 当歌曲可以播放的时候（移动端浏览器监听不到 audio 的 canPlay ？？）
      play () {
      	this.songReady = true
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
      }
    },
    watch: {
      // 监听歌曲改变， 播放歌曲
      currentSong (newSaong, oldSong) {
        if (newSaong.id === oldSong.id) {
          return
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      // 监听 playing，播放 || 暂停
      playing (newPlaying) {
        this.$nextTick(() => {
          let audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      'progress-bar': ProgressBar,
      'progress-circle': ProgressCircle
    }
  }
</script>
<style lang="stylus">
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
        .icon-play-mini, .icon-pause-mini
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