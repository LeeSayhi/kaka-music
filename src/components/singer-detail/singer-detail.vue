<template>
	<div class="singer-detail">nnn</div>
</template>
<script>
	import {mapGetters} from 'vuex'

	export default {
		computed: {
			...mapGetters([
				'singer'
			])
		},
		created () {
			console.log(this.singer)
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