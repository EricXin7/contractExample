export default {
    mounted() {
        // 为了记忆最后一次玩的游戏
        localStorage.setItem('__history_poker_to__', this.$route.fullPath)
        this.$nextTick(() => {
            let iframe = document.querySelector('#yy-game-iframe')
            if (iframe) {
                let bcrect = iframe.getBoundingClientRect()
                let actHeight = (bcrect.width / 1800) * 800
                iframe.style.height = actHeight + 'px'
            }
        })
    },
    destroyed() {
        let iframe = document.querySelector('#yy-game-iframe')
        if (iframe) {
            iframe.src = '/favicon.ico'
            document.querySelector('.iframe-outer').style.height = iframe.style.height
            document.querySelector('.iframe-outer').removeChild(iframe)
        }
    }
}
