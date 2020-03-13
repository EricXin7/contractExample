/* eslint-disable indent */
/* eslint-disable default-case */
/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import { notification } from 'ant-design-vue'

// 挂载全局事件
export default () => {
    const EnumCode = (code, remark = '') => {
        let db = {
            '600': '网络异常,请您稍后再试',
            '700': '网络异常,请您稍后再试',
            '2001': '网络异常,请您稍后再试',
            53002: window.$nuxt.$t('t052')
        }
        return (db[code] || '').replace('%s', remark)
    }

    const wallet = {
        bindChange() {
            if (!window.bcbWeb) {
                return
            }
            // 选择的账户改变时触发。
            window.bcbWeb.onAccountChanged(account => {
                setTimeout(() => window.$bus.$emit('wallet-accound-change', account))
                // if (account.address) {
                //     // 用户已登录钱包
                //     // { address: 'bcbJjYFgmG52r2vnVcaSoBKKoUTxmMedjm8p', name: 'acount01'}
                //     console.log('账户名:', account.name, '账户地址:', account.address)
                // } else {
                //     // 用户已退出登录
                //     // { address: null, name: null }
                //     console.log('未登录')
                // }
            })
            // 选择的链改变时触发。
            window.bcbWeb.onChainChanged(chain => {
                wallet.walletChangeTip(chain)
                // { network: 'bcb', chain: 'bcb' }
            })
        },
        isInstall() {
            return Boolean(window.bcbWeb)
        },
        isLogin() {
            if (!wallet.isInstall()) {
                wallet.notifyError(window.$nuxt.$t('t049'), window.$nuxt.$t('t050'), 0, 'longerror')
                return false
            } else if (!window.bcbWeb.ready && window.bcbWeb.requestLogin) {
                window.bcbWeb
                    .requestLogin()
                    .then(result => {
                        // 更新钱包信息
                        window.$nuxt.$store.dispatch('updateWallet')
                    })
                    .catch(err => {
                        console.error('钱包登录信息：', err)
                    })
                return false
            }
            window.$nuxt.$store.dispatch('updateWallet')
            return true
        },
        walletChangeTip(chain) {
            // if (chain.chain != 'yy') {
            //     wallet.notifyError('当前游戏仅支持yy侧链，请切换钱包网络', '钱包提示', 0, 'longerror')
            // } else {
            //     wallet.notifyClose('longerror')
            // }
        },
        selectedAccount() {
            if (window.bcbWeb && window.bcbWeb.ready) {
                let chain = window.bcbWeb.selectedChain || {}
                wallet.walletChangeTip(chain)
            }
            return window.bcbWeb && window.bcbWeb.ready ? window.bcbWeb.selectedAccount : ''
        },
        getBalance(symbol) {
            let $symbol = symbol
            if (wallet.selectedAccount()) {
                if ($symbol && $symbol.length < 6) {
                    return window.bcbWeb.getBalanceBySymbol($symbol)
                } else if ($symbol.length > 20) {
                    return window.bcbWeb.getBalance($symbol)
                }
                return Promise.reject(new Error('Incorrect address'))
            }
            return Promise.resolve(0)
        },
        // act: 1: 申请坐庄, 2：申请退款, 3：下注
        action(txs) {
            if (wallet.isLogin()) {
                return new Promise((resolve, reject) => {
                    console.log('txs', JSON.stringify(txs))
                    window.bcbWeb
                        .sendTransaction(txs)
                        .then(resolve)
                        .catch(err => {
                            console.log('jsonErr', err)
                            let code = ''
                            let lcode = err.match(/(?<=[<\[])(\d+)(?=[>\]])/g)
                            if (lcode) {
                                code = [lcode[0] || '', lcode[1] || ''].join('')
                            }
                            // 解析备注
                            let remark = ''
                            let lrmk = err.match(/\{(.+)\}/)
                            if (lrmk && lrmk[1]) {
                                remark = lrmk[1]
                            }
                            // 解析品牌ID
                            let brandid = ''
                            let lbid = err.match(/\((.+)\)/)
                            if (lbid && lbid[1]) {
                                brandid = lbid[1]
                            }
                            wallet.notifyError(EnumCode(code, remark, brandid) || err, window.$nuxt.$t('t051'))
                            reject(err)
                        })
                })
            }
        },
        notify({ message, description, duration = 4.5, key }, type) {
            let h = window.$nuxt.$createElement
            notification[type]({
                key: key || type,
                message,
                description,
                duration,
                class: 'globle-notification globle-notification-' + type,
                icon: h('a-icon', {
                    attrs: {
                        type: type == 'error' ? 'frown' : 'smile'
                    }
                })
            })
        },
        notifyError(description, message, duration = 5, key) {
            wallet.notify(
                {
                    message,
                    description,
                    duration,
                    key
                },
                'error'
            )
        },
        notifySuccess(description, message, duration = 2, key) {
            wallet.notify(
                {
                    message,
                    description,
                    duration,
                    key
                },
                'success'
            )
        },
        notifyClose(key) {
            notification.close(key)
        }
    }
    try {
        // 绑定钱包的事件
        wallet.bindChange()
        Vue.prototype.$wallet = window.$wallet = wallet
    } catch (error) {
        Vue.prototype.$wallet = wallet
    }
}
