<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-linner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" 
             ref="progressBtn"
             @touchstart.stop.prevent="progressTouchstart"
             @touchmove.stop.prevent="progressTouchmove"
             @touchend.stop.prevent="progressTouchend"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {prefixStyle} from 'common/js/dom'
  const transform = prefixStyle('transform')
  const progressBtnWidth = 16

  export default {
    props: {
      percent: {   // 进度占比
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    watch: {
      percent (newPercent) {
        if (newPercent > 0 && !this.touch.init) {
          const progressWidth = this.$refs.progressBar.clientWidth * newPercent
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * newPercent

          this.$refs.progress.style.width = `${progressWidth}px`   // 进度条宽度
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`   // 进度按钮 偏移距离
        }
      }
    },
    methods: {
      progressTouchstart (e) {
        this.touch.init = true  // 拖动的标识符（为了让拖动和自动播放不冲突）
        this.touch.x1 = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchmove (e) {
        this.touch.x2 = e.touches[0].pageX
        const detailX = this.touch.x2 - this.touch.x1
        // 拖动的距离（Math.max（不能超过总长最左边），Math.min（不能超过总长最右边））
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, (Math.max(0, this.touch.left + detailX)))
        this._offset(offsetWidth)
      },
      progressTouchend () {
        this.touch.init = false
        this._triggerPercent()
      },
      // 进度条宽度 &&  进度按钮的偏移距离
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      // 拖动距离在总长的占比
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth

        this.$emit('percentChange', percent)
      },
      progressClick (e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left

        this._offset(offsetWidth)
        this._triggerPercent()
      }
    }
  }
</script>
<style lang="stylus">
  @import '~common/stylus/variable.styl'

  .progress-bar
    height: 30px
    .bar-linner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>