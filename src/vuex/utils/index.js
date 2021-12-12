/**
 * 遍历对象，将属性和属性回传给回调函数
 * @param obj
 * @param callback
 */
export const forEachValue =  (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(obj[key], key)
    })
}
