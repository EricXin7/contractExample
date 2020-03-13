/* eslint-disable curly */
/* eslint-disable no-underscore-dangle */
export default function(id) {
    function _scrollTo(top) {
        try {
            scrollTo({
                top: top,
                behavior: 'smooth'
            })
        } catch (e) {
            scrollTo(0, top)
        }
    }
    if (!id) return _scrollTo(0)
    let body = document.body,
        doc = document.documentElement
    let el = document.querySelector(id)
    if (!el) return
    let offsetTop = el.getBoundingClientRect().top + (body.scrollTop || doc.scrollTop)
    _scrollTo(offsetTop - 100)
}
