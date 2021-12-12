import Module from "@/vuex/module/module";
import {forEachValue} from "@/vuex/utils";
/**
 * 返回模块的根结点
 {
    root:{
            _row: '默认显示用户的原始内容',
            _children:{
            a: {_row: 'a模块的原始内容', _children: {},state: aState}
            b: {_row: 'b模块的原始内容', _children: {},state: bState}
          },
        state: '根模块的状态'
     }
 }
 */
export default class ModuleCollection{
    constructor(options) {
        this.root = null; // 最后将数据绑到root上
        // [父亲模块，儿子模块，孙子模块]
        let root = this.register([], options)
    }
    // path: [] => [a] => [a, c]
    register (path, rootModule) {
        // debugger
        let module = new Module(rootModule)
        if (!path.length) { // 是根结点
            this.root = module
        } else {
            // 找到父模块， 从根结点开始找，找到path倒数第二个对应的module，就是父模块
            // array.reduce(function(total：计算结束后的返回值, currentValue：当前值, currentIndex：当前索引, arr：数组本身), initialValue：total的初始值)
            // parent, memo都是Module的实例
            let parent = path.slice(0, -1).reduce((memo, currentVal) => {
                return memo.getChild(currentVal)
            }, this.root)
            parent.setChild(path[path.length - 1], module)
        }
        if (rootModule.modules) {
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module)
            })
        }
        return module
    }
}
