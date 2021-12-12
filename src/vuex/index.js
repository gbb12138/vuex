import ModuleCollection from "@/vuex/module/module-collection";
let Vue;
const installModule = (store, path, module, rootState) => {
    // 将子模块的state都加到根模块的state中  $store.state.a.aAge
    if (path.length > 0) { // path：[a] => [a,c]
        // 是子模块， 给rootState添加模块名称作属性
        // 合并后的根state = rootState: {
        //   ...
        //   a:{
        //      ...
        //      c: {}
        //   },
        //   b:{}
        // }
        let parent = path.slice(0, -1).reduce((memo, current)=> {
            return memo[current]
        }, rootState)
        Vue.set(parent, path[path - 1], module.state)
    }

    // 多个同名的mutation，commit时都会执行
    module.forEachMutation((mutation, mutationKey) => {
        store._mutations[mutationKey] = store._mutations[mutationKey] || []
        store._mutations[mutationKey].push((payload) => {
            mutation(module.state, payload)
        })
    })
    // 多个同名的action，dispatch时都会执行
    module.forEachAction((action, key) => {
        store._actions[key] = (store._actions[key] || [])
        store._actions[key].push((payload) => {
            action(store, payload)
        })
    })
    // todo：同名getter会覆盖 ？？？
    module.forEachGetter((getter, key) => {
        store._wrappedGetters[key] = () => {
            return getter(module.state)
        }
    })
    // 递归子模块
    module.forEachChildren((child, key) => {
        installModule(store,path.concat(key),child, rootState)
    })
}
class Store{
    constructor(options) {
        // 1 对用的数据格式化，生成module树
        // {
        //      root: {
        //         _row: '默认显示用户的原始内容',
        //         _children:{
        //             a: {_row: 'a模块的原始内容', _children: {},state: aState}
        //             b: {_row: 'b模块的原始内容', _children: {},state: bState}
        //         },
        //         state: '根模块的状态'
        //      }
        // }
        let store = this;
        this._module = new ModuleCollection(options);
        this._mutations = {}; // 收集所有的mutation
        this._actions = {}; // 收集所有的actions
        this._wrappedGetters = {}; // 收集所有的getters

        let state = options.state; // 根模块的state
        this._vm = new Vue({
            data: {
                $$state: state
            }
        })
        installModule(store,[],store._module.root, state)
        console.log(store, 777)
    }
    /**
     * 实现state
     */
    get state () {
        return this._vm._data.$$state
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
