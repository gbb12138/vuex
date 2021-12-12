<template>
  <div id="app">
    <p>我的年纪{{$store.state.age}}</p>
    <p>你的年纪{{$store.getters.getAge}}</p>
    <p>你的年纪{{$store.getters.getAge}}</p>
    <button @click="$store.commit('changeAge', 10)">同步修改</button>
    <button @click="$store.dispatch('changeAge', 5)">异步修改</button>
    <button @click="$store.state.age++">恶心更新</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  mounted() {
    console.log(this.$store, 'APP mounted')
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
  margin-top: 60px;
}
</style>
