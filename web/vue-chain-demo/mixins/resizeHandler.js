const { body } = document
const RATIO = 3

export default {
    data() {
        return {
            hidden: 'hidden'
        }
    },
    watch: {
        $route() {
            if (this.isShowMobileSidebar) {
                this.$store.dispatch('config/closeSideBar', { withoutAnimation: false })
            }
        }
    },
    beforeMount() {
        this.resizeEventHandler('addEventListener')
        this.visibilitychangeHandle('addEventListener')
    },
    mounted() {
        const isMobile = this.isMobile()
        if (isMobile) {
            this.$store.dispatch('config/toggleDevice', 'mobile')
            this.$store.dispatch('config/closeSideBar', { withoutAnimation: true })
        }
        this.isSmallMobile()
    },
    methods: {
        isMobile() {
            const rect = body.getBoundingClientRect()
            return rect.width - RATIO < 1300
        },
        isSmallMobile() {
            // const rect = body.getBoundingClientRect()
            // let issm = rect.width - RATIO < 990
            // this.$store.dispatch('config/toggleMenuDir', issm ? 'horizontal' : 'vertical')
        },
        resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.isMobile()
                this.$store.dispatch('config/toggleDevice', isMobile ? 'mobile' : 'desktop')
                this.isSmallMobile()
                if (isMobile && this.opened) {
                    this.$store.dispatch('config/closeSideBar', { withoutAnimation: true })
                }
                this.$bus.$emit('window-resize-change', body.getBoundingClientRect())
            }
        },
        resizeEventHandler(eventName) {
            window[eventName]('resize', this.resizeHandler)
        },
        visibilitychangeHandle(eventName) {
            //各个浏览器属性兼容
            if (this.hidden in document) {
                document[eventName]('visibilitychange', this.visibilitychange)
            } else if ((this.hidden = 'mozHidden') in document) {
                document[eventName]('mozvisibilitychange', this.visibilitychange)
            } else if ((this.hidden = 'webkitHidden') in document) {
                document[eventName]('webkitvisibilitychange', this.visibilitychange)
            } else if ((this.hidden = 'msHidden') in document) {
                document[eventName]('msvisibilitychange', this.visibilitychange)
            } else if ('onfocusin' in document) {
                document.onfocusin = document.onfocusout = this.visibilitychange
            } else {
                window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this.visibilitychange
            }
        },
        visibilitychange() {
            let active = !document[this.hidden]
            this.$bus.$emit('browser-active', active)
            active && this.$store.dispatch('mpushClose')
        }
    },
    destroyed() {
        this.resizeEventHandler('removeEventListener')
        this.visibilitychangeHandle('removeEventListener')
    }
}
