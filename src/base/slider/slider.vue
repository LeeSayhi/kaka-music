<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot>
			</slot>			
		</div>
		<div class="dots">
			<span class="dot" v-for="(dot, index) in dots" :class="{active: currentIndex === index}"></span>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	export default {
	  data () {
	    return {
	      dots: [],
	      currentIndex: 0
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
	  		default: 4000
	  	}
	  },
	  mounted () {
	  	setTimeout(() => {
	  		this._setSliderWidth()
	  		this._initDots()
	  		this._initSlider()
	  	}, 20)
	  },
	  methods: {
	  	// 计算并设置容器宽度
	    _setSliderWidth () {
	      this.children = this.$refs.sliderGroup.children

	      let width = 0  // 总宽度
	      let sliderWidth = this.$refs.slider.clientWidth // 父容器的宽度（也就是一张图片的宽度，定宽）
	      for (let i = 0; i < this.children.length; i++) {
	        let child = this.children[i]
	        child.style.width = sliderWidth + 'px'
	        // width = sliderWidth * this.children.length
	        width += sliderWidth
	      }
	      // 如果循环播放的话，两边会分别别添加一个元素
	      if (this.loop) {
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

	    	// 监听BScroll滚动结束事件获取当前元素索引
	    	this.slider.on('scrollEnd', () => {
	    		let pageIndex = this.slider.getCurrentPage().pageX
	    		if (this.loop) {
	    			pageIndex -= 1
	    		}
	    		this.currentIndex = pageIndex
	    	})
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
	 				border-radius: 50%
	 				background: $color-text-ll
</style>