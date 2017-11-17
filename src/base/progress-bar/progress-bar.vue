<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-linner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"></div>
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
    watch: {
      percent (newPercent) {
        if (newPercent > 0) {
          let progressWidth = this.$refs.progressBar.clientWidth * newPercent

          let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          let offsetWidth = barWidth * newPercent

          this.$refs.progress.style.width = `${progressWidth}px`   // 进度条宽度
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`   // 进度按钮 偏移距离
        }
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