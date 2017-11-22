<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot>
			</slot>			
		</div>
		<div class="dots">
			<span class="dot" v-for="(dot, index) in dots" :class="{active: currentPageIndex === index}"></span>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	import {addClass} from	'common/js/dom.js'

	export default {
	  data () {
	    return {
	      dots: [],
	      currentPageIndex: 0
	    }
	  },
	  props: {
	  	loop: {
	  		type: Boolean,
	  		default: true
	  	},
	  	autoPlay: {
	  		type: Boolean,
	  		default: true
	  	},
	  	interval: {
	  		type: Number,
	  		default: 1000
	  	},
	  	data: {
	  		type: Array,
	  		default: null
	  	}
	  },
	  mounted () {
	  	setTimeout(() => {
	  		this._setSliderWidth()
	  		this._initDots()
	  		this._initSlider()
	  		if (this.autoPlay) {
	  			this._play()
	  		}
	  	}, 20)
	  	// 视口大小改变时重新设置宽度并计算宽度
	  	window.addEventListener('resize', () => {
	  		if (!this.slider) {
	  			return
	  		}
	  		this._setSliderWidth(true)
	  		this.slider.refresh()
	  	})
	  },
	  activated () {
  		if (this.autoPlay) {
  			this._play()
  		}
	  },
 		destroyed () {
      clearTimeout(this.timer)
    },
	  methods: {
	  	/*
			 * 设置并计算容器宽度
			 * isRsize: {type: Boolean}
			 * desc：视口大小改变时重新计算宽度不需要前后各添加一个元素
	  	*/
	    _setSliderWidth (isRsize) {
	      this.children = this.$refs.sliderGroup.children

	      let width = 0  // 总宽度
	      let sliderWidth = this.$refs.slider.clientWidth // 父容器的宽度（也就是一张图片的宽度，定宽）
	      for (let i = 0; i < this.children.length; i++) {
	        let child = this.children[i]
	        child.style.width = sliderWidth + 'px'
	        // width = sliderWidth * this.children.length
	        width += sliderWidth

	        addClass(child, 'slider-item')
	      }
	      // 如果循环播放的话，前后会分别别添加一个元素（视口改变时不需要）
	      if (this.loop && !isRsize) {
	      	width += 2 * sliderWidth
	      }

	      this.$refs.sliderGroup.style.width = width + 'px'
	    },
	    // 设置dots个数
	    _initDots () {
	    	this.dots = new Array(this.children.length)
	    },
	    // 用BScroll初始化轮播
	    _initSlider () {
	    	this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: { // 循环滚动
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
	    	})

	    	this.slider.on('scrollEnd', this._onscrollEnd)

	    	this.slider.on('touchend', () => {
	    		if (this.autoPlay) {
	    			this._play()
	    		}
	    	})

	    	// 监听滚动（手动）开始之前事件，如果是自动轮播就清除
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
	    },
    	// BScroll滚动结束 获取当前元素索引
    	_onscrollEnd () {
    		let pageIndex = this.slider.getCurrentPage().pageX
    		if (this.loop) {
    			pageIndex -= 1
    		}
    		this.currentPageIndex = pageIndex
    		if (this.autoPlay) {
    			this._play()
    		}
    	},
    	// 自动轮播
    	_play () {
    		let pageIndex = this.slider.getCurrentPage().pageX + 1
    		clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
    	}
		}
	}
</script>
<style lang="stylus">
	 @import "~common/stylus/variable"
	 .slider
	 	.slider-group
	 		position: relative
	 		overflow: hidden
	 		white-space: nowrap
	 		.slider-item
	 			float: left
	 			box-sizing: border-box
	 			overflow: hidden
	 			text-decoration: none
	 			a
	 				display: block
	 				width: 100%
	 				overflow: hidden
	 				text-decoration: none
	 			img
	 				display: block
	 				width: 100%
	 	.dots
	 		position: absolute
	 		right: 0
	 		left: 0
	 		bottom: 12px
	 		text-align: center
	 		font-size: 0
	 		.dot
	 			display: inline-block
	 			margin: 0 4px
	 			width: 8px
	 			height: 8px
	 			border-radius: 50%
	 			background: $color-text-l
	 			&.active
	 				width: 20px
	 				border-radius: 5px
	 				background: $color-text-ll
</style>