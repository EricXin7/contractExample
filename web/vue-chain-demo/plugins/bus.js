import Vue from 'vue'
// 挂载全局事件
export default () => {
    let bus = new Vue()
    let timeoutIDs = {}
    let delay = {
        add(pageId, fn, timer) {
            let timeoutID = setTimeout(fn, timer)
            if (timeoutIDs[pageId]) {
                timeoutIDs[pageId].push(timeoutID)
            } else {
                timeoutIDs[pageId] = [timeoutID]
            }
        },
        clear(pageId, timeoutID) {
            if (!pageId) {
                return
            }
            if (!timeoutIDs[pageId]) {
                return
            }
            timeoutIDs[pageId].forEach(id => {
                if (timeoutID && timeoutID == id) {
                    clearTimeout(id)
                } else if (!timeoutID) {
                    clearTimeout(id)
                }
            })
            if (timeoutID) {
                delete timeoutIDs[pageId]
            }
        }
    }
    try {
        Vue.prototype.$bus = window.$bus = bus
        Vue.prototype.$delay = window.$delay = delay
    } catch (error) {
        Vue.prototype.$bus = bus
        Vue.prototype.$delay = delay
    }
}
