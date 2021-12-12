/**
 * 1. 需要实现一个vuex插件， 将用户传入的store变成每个组件的$store， 实现state，getters,mutation,action
 * state => 放到vue实例的data中，变成响应式的数据，取state时返回data中的数据
 * getters => 放到vue实例中的computed中，取getters时代理到vue实例的computed
 */
let Vue;
const forEachValue =  (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(obj[key], key)
    })
}
class Store{
    constructor(options) {
        // this.state = options.state; // 这样通过$store能拿到state，但state不是响应式的
        let state = options.state;
        let computed = {};
        /**
         * 实现computed
         */
        let getters = options.getters;
        this.getters = {};
        // Object.keys(getters).forEach(key => {
        //     // 组装computed
        //     computed[key] = () => {
        //         return getters[key](this.state)
        //     }
        //     // 劫持取getters时去computed取
        //     Object.defineProperty(this.getters, key, {
        //         get:() => {
        //             return this.vm[key]  //去computed取时，computed依赖的值不变，watcher的dirty为false，不会触发重新计算
        //         }
        //     })
        // })
        forEachValue(getters, (value, key) => {
            // 组装computed
            computed[key] = () => {
                return value(this.state)
            }
            // 劫持取getters时去computed取
            Object.defineProperty(this.getters, key, {
                get:() => {
                    return this.vm[key]  //去computed取时，computed依赖的值不变，watcher的dirty为false，不会触发重新计算
                }
            })
        })
        this.vm = new Vue({
            data () {
                return {
                    $$state: state // 定义以$开头的属性不会定义在vm上
                }
            },
            computed
        })
        /**
         * 实现mutation
         */
        let mutations = options.mutations;
        this.mutations = {};
        forEachValue(mutations, (fn, key) => {
            this.mutations[key] = (payload) => fn(this.state, payload)
        })
        /**
         * 实现actions
         */
        let actions = options.actions;
        this.actions = {};
        forEachValue(actions, (fn, key) => {
            this.actions[key] = (payload) => fn(this, payload)
        })

    }
    /**
     * 实现state
     */
    get state () {
        return this.vm._data.$$state
    }
    // store.commit('changeAge', payload)
    commit = (type, payload) => { // 使用箭头函数，使this永远指向store
        this.mutations[type](payload);
    }
    dispatch = (type, payload) => {
        this.actions[type](payload)
    }
}
const Vuex = {
    Store,
    install(_vue) {
        Vue = _vue
        // 这里不使用Vue.prototype.$store会覆盖到所有的Vue实例，都能拿到store, 只希望覆盖发到跟组件的子组件
        // 需要获取到父组件中定义的store属性，每个组件运行的时候都能拿到store
        Vue.mixin({
            beforeCreate() {
                // 传入的声明数据会先放在Vue.options（保存所有的全局属性）中保存，当组件实例化的时候，
                // 又将Vue.options和用户传入的options合并，放到实例的$options中
                console.log('mixin组件执行', this.$options.name);
                // 当执行beforeCreate时，是在实例调用callHook方法，将声明周期函数的this指向vm（当前实例）
                const options = this.$options;
                // 共享store, 根组件(main.js中的#app) store=> 子组件(App.vue组件)store => 孙子组件store...
                if (options.store) { // 是跟组件 =》 #app对应的组件
                    this.$store = options.store;
                } else { // 不是跟组件，可能是跟组件的子组件，也可能是跟app同级的其他组件
                    let parent = this.$parent; // 拿到父组件
                    if (parent && parent.$store) { // 如果组件有父组件，将父组件的$store給子组件
                        this.$store = parent.$store
                    }
                }
            }
        })
    }
}

export default Vuex;
