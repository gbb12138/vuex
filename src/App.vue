<template>
  <div id="app">
    <p>我的年纪{{$store.state.age}}</p>
    <p>你的年纪{{$store.getters.getAge}}</p>
    <button @click="$store.commit('changeAge', 10)">同步修改</button>
    <button @click="$store.commit('a/changeAge', 10)">命名空间同步修改</button>
    <button @click="$store.dispatch('changeAge', 5)">异步修改</button>
    <button @click="$store.state.age++">强行更新</button>
    <p>a的状态{{$store.state.a.aAge}}</p>
    <p>b的状态{{$store.state.b.bAge}}</p>
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
