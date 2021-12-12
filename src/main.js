import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  name: 'root',
  store,   // 让所有组件共享这个容器， 从跟组件中注入，应用可以是多个实例的
  render: h => h(App)
}).$mount('#app')
