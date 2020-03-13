/* eslint-disable no-debugger */
/* eslint-disable no-console */
export default function({ store, redirect }) {
    if (store.getters.isAuthenticated) {
        return redirect(store.getters.homePageUrl)
    }
}
