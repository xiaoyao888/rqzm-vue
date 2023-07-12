<template>
<!--  <Desktop msg="Welcome to Your Vue.js App"/>-->
  <router-view />
</template>

<script>
import Desktop from '@/views/desktop/desktop.vue'

export default {
  name: 'App',
  components: {
    Desktop
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
