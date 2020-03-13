/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
export default {
    data() {
        return {
            isAlive: true
        }
    },
    mounted() {
        this.connect()
    },
    methods: {
        connect() {
            let that = this
            this.$bus.$emit('mpush-message-connecting')
            this.$store.dispatch('mpushConnect', {
                url: 'wss://' + (process.env.wss || location.hostname) + '/ws',
                listener: {
                    onOpened() {
                        // 绑定用户，为防止查询基本配置getBaseInfo查询成功时socket没有初使化
                        that.$store.dispatch('mpushBindUser')
                    },
                    onClosed: function(_event) {
                        // 重连socket
                        that.isAlive && setTimeout(that.connect)
                    },
                    onHandshake: function() {},
                    onBindUser: function(_success) {
                        that.$bus.$emit('mpush-message-connected')
                    },
                    onReceivePush: function(message, _messageId) {
                        // 接收到的消息
                        try {
                            let jsonMessage = JSON.parse(message)
                            let jsonMsg = JSON.parse(jsonMessage.content)
                            let body = jsonMsg.body || jsonMsg
                            if (Boolean(process.env.wss) || window.show_log) {
                                console.log('接收到的消息 %s 为 %O', jsonMsg.type, body)
                            }
                            that.$bus.$emit('mpush-message', body, jsonMsg.type)
                        } catch (error) {}
                    },
                    onKickUser: function(_userId, _deviceId) {
                        // 用户被踢，Socket断了，是否需要重新连接
                        that.isAlive = false
                    }
                }
            })
        }
    }
    // ,
    // beforeDestroy() {
    //     this.isAlive = false
    //     this.$store.dispatch('mpushClose')
    // }
}
