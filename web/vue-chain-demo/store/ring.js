/* eslint-disable no-shadow */
export const state = () => ({})

export const mutations = {}

export const actions = {
    // 头部点击展开收起左侧菜单栏
    getCurrentBetList(store, { gameType, roomId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.$axios.$get(`/api/chain/${gameType}/currentBetList`, { roomId })
                if (res && res.data) {
                    resolve(res.data)
                }
            } catch (e) {
                reject(e)
            }
        })
    }
}
