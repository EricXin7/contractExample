/* eslint-disable curly */
/* eslint-disable no-console */
export default function({ isServer, store, req }) {
    // If nuxt generate, pass this middleware
    if (isServer && !req) return
    store.dispatch('nuxtServerInit', { req })
}
