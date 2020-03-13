/* eslint-disable no-shadow */

export const state = () => ({
    sidebar_width: '350px',
    device: 'desktop',
    menu_dir: 'vertical', // horizontal：横
    opened: true
})

export const mutations = {
    CLOSE_SIDEBAR: state => {
        state.opened = false
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    TOGGLE_SIDEBAR(state, isshow) {
        state.opened = typeof isshow == 'boolean' ? isshow : !state.opened
    },
    TOGGLE_MENU_DIR(state, dir) {
        state.menu_dir = dir
    }
}

export const actions = {
    // 头部点击展开收起左侧菜单栏
    toggleSideBar({ commit }, isshow) {
        commit('TOGGLE_SIDEBAR', isshow)
    },
    // 计算显示隐藏左侧菜单栏
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    toggleMenuDir({ commit }, dir) {
        commit('TOGGLE_MENU_DIR', dir)
    }
}
