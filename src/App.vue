<template>
  <Desktop msg="Welcome to Your Vue.js App"/>
</template>

<script>
import Desktop from './components/desktop.vue'

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
