/* eslint-disable no-implicit-coercion */
/* eslint-disable curly */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import Vue from 'vue'

const keepFloat = function(str, len = 3) {
    const reg = new RegExp('\\d+(\\.\\d{1,' + len + '})?', 'g')
    const res = reg.exec(str + '')
    return res ? +res[0] : ''
}

/**
 * 数字保留小数位, 不自动补足位数
 */
Vue.filter('float', function(str, len = 3) {
    return keepFloat(str, len)
})

/**
 * 千分位，将数字格式化为100,000,000这种格式
 */
const thousands = function(num, split = ',') {
    if (num === Infinity) return '∞'
    return (
        num &&
        num.toString().replace(/([+-]?)(\d+)([.]\d+)?/, function($0, $1, $2, $3) {
            return (
                $1 +
                $2.replace(/(\d)(?=(\d{3})+$)/g, function($10, $11) {
                    return $11 + split
                }) +
                ($3 || '')
            )
        })
    )
}
Vue.filter('thousands', thousands)

/**
 * 银行卡，四位一分隔
 */
Vue.filter('bankcard', function(txt, split = ' ') {
    return String(txt)
        .replace(/[^0-9]/g, '')
        .replace(/(\d{4})(?!$)/g, '$1' + split)
})

/**
 * 格式化时间
 */
const yyyymmdd = function(val, fmt = 'yyyy-MM-dd hh:mm:ss', auto = true) {
    if (!val) return '-'
    try {
        val = new Date(val)
    } catch (e) {
        val = new Date(val.toString().indexOf('-') !== -1 ? val.replace(new RegExp(/-/gm), '/') : val)
    }
    const now = new Date()
    const c = {
        'y+': now.getFullYear(),
        'M+': now.getMonth() + 1,
        'd+': now.getDate()
    }
    const o = {
        'y+': now.getFullYear() + '',
        'M+': val.getMonth() + 1, // 月份
        'd+': val.getDate(), // 日
        'h+': val.getHours(), // 小时
        'm+': val.getMinutes(), // 分
        's+': val.getSeconds(), // 秒
        'q+': Math.floor((val.getMonth() + 3) / 3), // 季度
        S: val.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        const year = +o['y+'].substr(4 - RegExp.$1.length)
        fmt = fmt.replace(RegExp.$1, auto ? (c['y+'] !== year ? year : '') : year)
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            const rval = RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            if (['M+', 'd+'].indexOf(k) !== -1 && auto && c['y+'] === o['y+'] && c['M+'] === o['M+'] && c['d+'] === o['d+']) {
                fmt = fmt.replace(RegExp.$1, '')
            } else {
                fmt = fmt.replace(RegExp.$1, rval)
            }
        }
    }
    let num = 0
    return fmt
        .split('')
        .map(item => {
            const isnum = parseInt(item, 10) >= 0
            return num ? item : isnum ? (num++, item) : ''
        })
        .join('')
}
Vue.filter('yyyymmdd', yyyymmdd)

// 时间戳没有3个0的
Vue.filter('yyyymmddutc', function(val, fmt, auto = true) {
    let loc = new Date()
    let utcLoc = loc.getTimezoneOffset() * 60 * 1e3
    return yyyymmdd(val * 1e3 - utcLoc, fmt, auto)
})

/**
 * 地址缩写，len是表示首尾保留几位
 */
Vue.filter('address', function(val = '', len = 4) {
    if (typeof val == 'object') return ''
    if (val.length <= len * 2) return val
    return [val.slice(0, len), val.slice(-len)].join('...')
})

/**
 * 将数字%1000
 */
Vue.filter('amountK', function(val = '', keep = 3, max = 1e6) {
    let num = parseFloat(val)
    if (!num) return '0'
    if (num < max) return thousands(keepFloat(num, keep))
    return [thousands(keepFloat(num / 1e3, keep)), 'K'].join('')
})
