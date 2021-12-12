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

/**
 * 返回模块的根结点
 root = {
    _row: '默认显示用户的原始内容',
    _children:{
    a: {_row: 'a模块的原始内容', _children: {},state: aState}
    b: {_row: 'b模块的原始内容', _children: {},state: bState}
    },
    state: '根模块的状态'
 }
 */
class ModuleCollection{
    constructor(options) {
        this.root = null; // 最后将数据绑到root上
        // [父亲模块，儿子模块，孙子模块]
        let root = this.register([], options)
        console.log(root, 7777)
    }
    // path: [] => [a] => [a, c]
    register (path, rootModule) {
        debugger
        let module = {
            _row: rootModule,
            _children: {},
            state: rootModule.state
        }
        if (!path.length) { // 是根结点
            this.root = module
        } else {
            // 找到父模块， 从根结点开始找，找到path倒数第二个对应的module，就是父模块
            // array.reduce(function(total：计算结束后的返回值, currentValue：当前值, currentIndex：当前索引, arr：数组本身), initialValue：total的初始值)
            let parent = path.slice(0, -1).reduce((memo, currentVal) => {
                return memo._children[currentVal]
            }, this.root)
            parent._children[path[path.length - 1]] = module
        }
        if (rootModule.modules) {
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module)
            })
        }
        return module
    }
}


class Store{
    constructor(options) {
        this._module = new ModuleCollection(options)
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
