/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable curly */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { getFromLocal } from '~/utils/auth'

Vue.use(VueI18n)

export default ({ app, store, route }) => {
    const _lang = getFromLocal('Language') || 'zh_CN'

    store.commit('SET_LANG', _lang)

    app.i18n = new VueI18n({
        locale: _lang,
        fallbackLocale: _lang,
        messages: {
            en: require('~/locales/en.json'),
            zh_CN: require('~/locales/zh_CN.json')
        }
    })

    app.i18n.Lang = lang => {
        if (app.i18n.locale === lang) return
        app.i18n.locale = lang
        store.commit('SET_LANG', lang)
    }
}
