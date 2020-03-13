/* eslint-disable no-param-reassign */
/**
 * 格式化倒计时的格式
 * @param {Number} val 倒计时间，单位秒
 * @param {String} fmt 格式，比如：mm′ ss″
 */
export default function(val, fmt) {
    const nDate = new Date(val * 1000)
    const match = nDate.toString().match(/([+-])(\d{2})(\d{2})/) || []
    const f = match[1] || '+'
    const h = parseInt(f + (match[2] || 0), 10)
    const m = parseInt(f + (match[3] || 0), 10)
    const fDate = new Date(Number(new Date('1970/01/01 00:00:00')) + h * 60 * 60 * 1000 + m * 60 * 1000)
    const o = {
        'y+': nDate.getFullYear() - fDate.getFullYear(),
        'M+': nDate.getMonth() - fDate.getMonth(), // 月份
        'd+': nDate.getDate() - fDate.getDate(), // 日
        'h+': nDate.getHours() - fDate.getHours(), // 小时
        'm+': nDate.getMinutes() - fDate.getMinutes(), // 分
        's+': nDate.getSeconds() - fDate.getSeconds(), // 秒
        S: nDate.getMilliseconds() - fDate.getMilliseconds() // 毫秒
    }
    const oo = {
        'y+': 12,
        'M+': 30,
        'd+': 24,
        'h+': 60, // 小时
        'm+': 60, // 分
        's+': 1000 // 秒
    }
    let prev = 0
    let i = 0
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            let ok = String(o[k])
            if (!i) {
                ok = String(prev + o[k])
                i++
            }
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? ok : ok.length > 2 ? ok : ('00' + ok).slice(-2))
        }
        !i && (prev = (prev + o[k]) * oo[k])
    }
    return fmt
}
