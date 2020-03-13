/* eslint-disable no-underscore-dangle */
/* eslint-disable no-empty */
/* eslint-disable indent */
/* eslint-disable default-case */
/* eslint-disable prettier/prettier */
/* eslint-disable no-implicit-coercion */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
import { setStorage, unsetStorage, getFromCookie, getFromLocal } from '~/utils/auth'
import mpush from '~/utils/socket'

function RandomCode(length) {
    let str = ''
    // eslint-disable-next-line no-empty
    for (
        ;
        str.length < length;
        str += Math.random()
            .toString(36)
            .substr(2)
    ) {}
    return str.substr(0, length)
}

export const state = () => ({
    brandinfo: {},
    roominfo: null,
    gameinfo: null,
    baseinfo: {},
    wallet: {},
    contracts: {},
    Authorization: '',
    GuestId: ['user', new Date().getTime(), RandomCode(10)].join(':'),
    locales: ['en', 'zh_CN'],
    locale: 'zh_CN',
    mpush: mpush()
})

export const mutations = {
    SET_LANG(state, lang = '') {
        try {
            state.locale = lang
            setStorage('Language', lang)
        } catch (error) {}
    },
    SET_WALLET(state, wallet = {}) {
        state.wallet = {
            ...wallet
        }
    },
    SET_USER(state, Authorization = '') {
        state.Authorization = Authorization
    },
    SET_BASEINFO(state, info) {
        state.baseinfo = {
            ...state.baseinfo,
            ...info
        }
    },
    SET_BRANDINFO(state, info) {
        state.brandinfo = {
            ...info
        }
    },
    SET_ROOMINFO(state, info) {
        state.roominfo = info
    },
    SET_GAMEINFO(state, info) {
        state.gameinfo = info
    }
}

export const actions = {
    nuxtServerInit({ commit, dispatch }, { req }) {
        let Authorization, lang
        if (req && req.headers && req.headers.cookie) {
            // Authorization = getFromCookie(req, 'Authorization')
            lang = getFromCookie(req, 'Language')
        } else {
            // Authorization = getFromLocal('Authorization')
            lang = getFromLocal('Language')
        }
        commit('SET_LANG', lang || '')
        commit('SET_USER', Authorization || '')
        // return Promise.all([dispatch('getBaseInfo')])
    },
    // 查询基本配置信息
    getBaseInfo({ state, commit, dispatch }, {gameUid, roomUid} = {}) {
        const gohome = () => {
            setTimeout(() => window.$nuxt.$router.replace('/buy'))
        }
        return new Promise(async (resolve, reject) => {
            try {
                // 查询品牌信息
                if (!state.brandinfo.brandUid) {
                    const res = await this.$axios.$get('/brand/info')
                    if (res && res.data) {
                        commit('SET_BRANDINFO', res.data)
                    }
                }
                // 查询游戏列表
                if (!state.gameinfo) {
                    const res = await this.$axios.$get('/brand/game/list')
                    if (res && res.data) {
                        commit('SET_GAMEINFO', res.data.content)
                    }
                }
                // 查询游戏房间列表
                if (gameUid) {
                    const res = await this.$axios.$get(`/brand/game/${gameUid}/rooms`)
                    if (res && res.data) {
                        let list = (res.data.content || []).filter(i => i.status == 1)
                        commit('SET_ROOMINFO', list)
                        !roomUid && list[0] && (roomUid = list[0]['roomUid'])
                    } else {
                        gohome()
                    }
                }
                // 查询游戏房间基本信息
                if (gameUid && roomUid) {
                    const res = await this.$axios.$get(`/brand/game/${gameUid}/room/${roomUid}`)
                    if (res && res.data) {
                        if (res.data.status == 1) {
                            commit('SET_BASEINFO', res.data)
                            // 绑定socket的用户，为防止socket连通时getBaseInfo没有查询成功
                            dispatch('mpushBindUser', roomUid)
                            return resolve(res.data)
                        }
                    }
                    gohome()
                }
                resolve(state.baseinfo)
            } catch (e) {
                gohome()
                reject(e)
            }
        })
    },
    mpushClose({ state }) {
        state.mpush.close(-2, 'before destroy')
    },
    // socket 初使化连接
    mpushConnect({ state }, cfg) {
        !state.mpush.isConnect() && state.mpush.connect({
            ...cfg,
            deviceId: 'yy-game-' + +new Date(),
            osName: 'web ' + navigator.userAgent,
            osVersion: '55.2',
            clientVersion: '1.0'
        })
    },
    // socket 绑定用户
    mpushBindUser({ state, dispatch }, roomId = state.baseinfo.roomUid) {
        let wallet = window.$wallet.selectedAccount() || {}
        let userId = wallet.address || state.Authorization || state.GuestId
        let isConnect = state.mpush.isConnect()

        if (roomId && isConnect) {
            state.mpush.bindUser(userId, roomId)
        }
        // 更新下钱包相关信息
        dispatch('updateWallet')
    },
    // 更新钱包信息
    updateWallet({ state, commit }) {
        window.$wallet.getBalance('devtest[yy]NFeEQYrd8rYcn9A58guCmyncQETk3Kjfr').then(balance => {
            let wallet = window.$wallet.selectedAccount() || {}
            commit('SET_USER', wallet.address)
            commit('SET_WALLET', {
                ...wallet,
                balance: balance / 1e9
            })
        })
    }
}
export const getters = {
    isAuthenticated(state) {
        return !!state.Authorization
    },
    homePageUrl() {
        return '/buy'
    },
    gameInfo0(state) {
        return state.baseinfo
    },
    gameInfo: (state) => (gameType, roomId) => {
        if (gameType && roomId) {
            let bsinfo = state.baseinfo[[gameType, roomId].join('-')]
            return bsinfo || state.baseinfo
        }
        return state.baseinfo
    },
    isMyPlace: (state, getters) => (gameType, roomId) => {
        let gameinfo = getters.gameInfo(gameType, roomId)
        return state.Authorization && (state.Authorization == gameinfo.currentBanker)
    },
    walletBalance(state) {
        return state.wallet.balance || 0
    }
}
