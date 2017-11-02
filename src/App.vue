<template>
  <div class="app">
    <v-header></v-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Header from 'components/header/header'
  import Tab from 'components/tab/tab'

  export default {
    components: {
      'v-header': Header,
      'v-tab': Tab
    }
  }
</script>

<style lang="stylus">
</style>
