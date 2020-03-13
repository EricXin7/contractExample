/* eslint-disable no-implicit-coercion */
/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable no-console */
import Cookie from 'vue-cookie'

export const setStorage = (key, Authorization) => {
    if (process.server) return
    window.localStorage.setItem(key, Authorization)
    Cookie.set(key, Authorization)
}

export const unsetStorage = key => {
    if (process.server) return
    window.localStorage.removeItem(key)
    Cookie.delete(key)
}

export const getFromCookie = (req, name) => {
    if (!req || !req.headers || !req.headers.cookie) return

    const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(name + '='))
    if (!jwtCookie) return

    return jwtCookie.split('=')[1]
}

export const getFromLocal = name => {
    if (process.server) return
    return Cookie.get(name) || window.localStorage.getItem(name)
}
