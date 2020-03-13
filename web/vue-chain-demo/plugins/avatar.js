/* eslint-disable no-empty */
import Vue from 'vue'
// 挂载全局事件
export default () => {
    let data = {}
    try {
        data = JSON.parse(localStorage.getItem('__avatar_user__') || '{}')
    } catch (error) {}

    function range(m, n) {
        return Math.floor(Math.random() * (m - n) + n)
    }
    let randomFn = address => {
        data[address] = `/avatar/${range(1, 13)}.png`
        localStorage.setItem('__avatar_user__', JSON.stringify(data))
        return data[address]
    }
    let def = '/avatar/0.png'
    let avatar = {
        default: def,
        random(address) {
            return address ? data[address] || randomFn(address) : def
        }
    }
    try {
        Vue.prototype.$avatar = window.$avatar = avatar
    } catch (error) {
        Vue.prototype.$avatar = avatar
    }
}
