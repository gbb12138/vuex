/**
 * 生成模块数据
 */
import {forEachValue} from "@/vuex/utils";

export default class Module {
    constructor(rootModule) {
        this._row = rootModule;
        this._children = {};
        this.state = rootModule.state;
    }

    getChild(key) {
        return this._children[key]
    }

    setChild(key, module) {
        this._children[key] = module
    }

    forEachMutation(callback) {
        if (this._row.mutations) {
            forEachValue(this._row.mutations, callback)
        }
    }

    forEachAction(callback) {
        if (this._row.actions) {
            forEachValue(this._row.actions, callback)
        }
    }

    forEachGetter(callback) {
        if (this._row.getters) {
            forEachValue(this._row.getters, callback)
        }
    }

    forEachChildren(callback) {
        if (this._children) {
            forEachValue(this._children, callback)
        }
    }
}


