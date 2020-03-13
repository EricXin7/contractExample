/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable curly */
/* eslint-disable no-eq-null */
/* eslint-disable indent */
/* eslint-disable default-case */
export default function() {
    let socket,
        session = {},
        ID_SEQ = 1
    // 配置实体
    let config = { listener: null, log: console }
    // 接收到消息后的执行事件实体
    // config.listener的作用是在外部调用时传入自定义事件处理方法
    let listener = {
        onOpened: function(event) {
            handshake()
            if (config.listener != null) {
                config.listener.onOpened(event)
            }
        },
        onClosed: function(event) {
            if (config.listener != null) {
                config.listener.onClosed(event)
            }
            session = {}
            ID_SEQ = 1
            socket = null
        },
        onHandshake: function() {
            // 握手成功执行心跳连接
            // heartbeat()

            session.handshakeOk = true
            if (config.listener != null) {
                config.listener.onHandshake()
            }
            // 握手成功自动绑定用户
            // if (config.userId) {
            //     bindUser(config.userId, config.tags)
            // }
        },
        onBindUser: function(success) {
            if (config.listener != null) {
                config.listener.onBindUser(success)
            }
        },
        onReceivePush: function(message, messageId) {
            if (config.listener != null) {
                config.listener.onReceivePush(message, messageId)
            }
        },
        onKickUser: function(userId, deviceId) {
            if (config.listener != null) {
                config.listener.onKickUser(userId, deviceId)
            }
            doClose(-1, 'kick user')
        }
    }
    // 枚举
    const Command = {
        HEARTBEAT: 1,   // 心跳连接
        HANDSHAKE: 2,   // 握手
        BIND: 5,        // 绑定用户
        UNBIND: 6,      // 解绑用户
        ERROR: 10,      // 错误
        OK: 11,         // 绑定成功
        KICK: 13,       // 踢出用户
        PUSH: 15,       // 发送消息
        ACK: 23,        //
        UNKNOWN: -1     // 未知
    }
    // 发送消息结构体
    function Packet(cmd, body, sessionId) {
        return {
            cmd: cmd,
            flags: 16,
            sessionId: sessionId || ID_SEQ++,
            body: body
        }
    }
    // 握手事件，设备id等信息
    function handshake() {
        send(
            Packet(Command.HANDSHAKE, {
                deviceId: config.deviceId,
                osName: config.osName,
                osVersion: config.osVersion,
                clientVersion: config.clientVersion
            })
        )
        // 保持socket连接，心跳检测，10s连接一次
        setTimeout(handshake, 10e3)
    }
    // 心跳事件，设备id等信息
    // function heartbeat() {
    //     send(
    //         Packet(Command.HEARTBEAT, {
    //             deviceId: config.deviceId,
    //             osName: config.osName,
    //             osVersion: config.osVersion,
    //             clientVersion: config.clientVersion
    //         })
    //     )
    //     // 保持socket连接，心跳检测，10s连接一次
    //     setTimeout(heartbeat, 10e3)
    // }
    // 绑定用户事件，tags为房间号，userId为当前用户钱包地址或者为默认值
    function bindUser(userId = '', tags) {
        if (userId && (userId != session.userId || tags != session.tags)) {
            // 如果session.userId存在是否要解绑之前的用户
            // session.userId && send(Packet(Command.UNBIND, { userId: session.userId, tags: tags }))
            // 绑定新用户
            session.userId = userId
            session.tags = tags
            send(Packet(Command.BIND, { userId: userId, tags: tags }))
        }
    }
    // 接收到数据后与后台保持连通事件
    function ack(sessionId) {
        send(Packet(Command.ACK, null, sessionId))
    }
    // 发送消息事件
    function send(message) {
        if (!socket) {
            return
        }
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
        } else {
            config.log.error('The socket is not open.')
        }
    }
    // 接收到消息后，解析消息体事件
    function dispatch(packet) {
        let userIdStr = 'userId: ' + session.userId
        switch (packet.cmd) {
            case Command.HANDSHAKE: {
                config.log.info('>>> handshake ok.')
                listener.onHandshake()
                break
            }
            case Command.OK: {
                if (packet.body.cmd == Command.BIND) {
                    config.log.info('>>> bind user ok.', userIdStr, 'tags: ', session.tags)
                    listener.onBindUser(true)
                }
                break
            }
            case Command.ERROR: {
                if (packet.body.cmd == Command.BIND) {
                    config.log.info('>>> bind user failure.' + userIdStr)
                    listener.onBindUser(false)
                }
                break
            }
            case Command.KICK: {
                if (session.userId == packet.body.userId && config.deviceId == packet.body.deviceId) {
                    config.log.info('>>> receive kick user.' + userIdStr)
                    listener.onKickUser(packet.body.userId, packet.body.deviceId)
                }
                break
            }
            case Command.PUSH: {
                config.log.debug('>>> receive push, content=' + packet.body.content)
                let sessionId
                if ((packet.flags & 8) != 0) {
                    ack(packet.sessionId)
                } else {
                    sessionId = packet.sessionId
                }
                listener.onReceivePush(packet.body.content, sessionId)
                break
            }
        }
    }
    // 接收到消息事件
    function onReceive(event) {
        config.log.debug('>>> receive packet=' + event.data)
        dispatch(JSON.parse(event.data))
    }
    // WebSocket连通事件
    function onOpen(event) {
        config.log.info('Web Socket opened!')
        listener.onOpened(event)
    }
    // WebSocket关闭事件
    function onClose(event) {
        config.log.info('Web Socket closed!')
        listener.onClosed(event)
    }
    // WebSocket出错事件
    function onError(event) {
        config.log.info('Web Socket receive, error')
        doClose()
    }
    // 手动关闭WebSocket事件
    function doClose(code, reason) {
        if (socket) socket.close()
        config.log.info('try close web socket client, reason=' + reason)
    }
    // 手动连通WebSocket事件
    // cfg里可以传入自定义测试事件，处理接收事件回传数据的处理逻辑
    function doConnect(cfg) {
        config = copy(cfg)
        socket = new WebSocket(config.url)
        socket.onmessage = onReceive
        socket.onopen = onOpen
        socket.onclose = onClose
        socket.onerror = onError
        config.log.info('try connect to web socket server, url=' + config.url)
    }
    // config扩展事件
    function copy(cfg) {
        for (let p in cfg) {
            if (cfg.hasOwnProperty(p)) {
                config[p] = cfg[p]
            }
        }
        return config
    }
    return {
        connect: doConnect,
        close: doClose,
        bindUser: bindUser,
        send,
        isConnect: function() {
            return Boolean(socket) && socket.readyState == WebSocket.OPEN
        }
    }
}
