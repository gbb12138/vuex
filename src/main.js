import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,   // 让所有组件共享这个容器， 从跟组件中注入
  render: h => h(App)
}).$mount('#app')
