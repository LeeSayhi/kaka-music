<template>
  <div class="search-list">
    <ul>
      <li class="search-item" v-for="item in data" @click="sealectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    methods: {
      sealectItem (item) {
        this.$emit('select', item)
      },
      deleteOne (item) {
        this.$emit('delete', item)
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import '~common/stylus/variable'

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      .text
        flex: 1
        color: $color-text-l
        font-size: $font-size-medium
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>