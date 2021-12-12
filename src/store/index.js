import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '@/vuex'
Vue.use(Vuex)
// vuex是一个插件，可以通过 use注册，vueX => {install, Store(类)}
const store = new Vuex.Store({
  strict: true,
  state: {  // 共享的状态，data
    age: 18,
  },
  getters: { // 计算属性 ==》 就是computed
    getAge (state) {
      console.log('run getters')
      return state.age - 1;
    }
  },
  mutations: { // 同步更改状态，在严格模式下，只能通过mutation来更改数据
    changeAge (state, payload) { // 只有两个参数，如果想传入多个数据，输入payload为对象
      state.age += payload
    }
  },
  actions: { // 异步更改状态
    changeAge ({commit}, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('changeAge', payload)
          resolve(payload)
        }, 1000)
      })
    }
  },
  modules: {
    a: {
      state: {
        aAge: 200
      },
      mutations: {
        changeAge (state, payload) {
          state.aAge += payload
        }
      },
      modules: {
        c: {
          state: {
            cAge: 400
          }
        }
      }
    },
    b: {
      state: {
        bAge: 300
      },
      mutations: {
        changeAge (state, payload) {
          state.bAge += payload
        }
      }
    }
  }
})
export default store;
