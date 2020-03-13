// export default ({ app }) => {
//     app.router.beforeEach((to, from, next) => {
//         if (from.path == '/home' && to.path != '/fqs') {
//             document.body.style.overflow = 'hidden'
//             let loading = document.querySelector('.loading-yy')
//             if (!loading) {
//                 loading = document.createElement('div')
//                 loading.className = 'loading-yy fixed top left bottom right'
//                 document.body.appendChild(loading)
//             }
//             let inner = loading.querySelector('.loading-inner')
//             if (!inner) {
//                 inner = document.createElement('div')
//                 inner.className = 'loading-inner'

//                 let img = document.createElement('div')
//                 img.className = 'img'

//                 inner.appendChild(img)
//                 loading.appendChild(inner)
//             }
//             loading.style.display = 'block'
//             setTimeout(() => {
//                 inner.style.backgroundPosition = 'bottom left, bottom right,top right'
//             }, 300)
//         }
//         next()
//     })
//     app.router.afterEach(route => {
//         setTimeout(() => {
//             let inner = document.querySelector('.loading-yy .loading-inner')
//             if (inner) {
//                 inner.style.backgroundPosition = 'bottom -100px left -100px, bottom -100px right -100px,top -100px right -100px'
//             }
//         }, 1500)
//         setTimeout(() => {
//             let loading = document.querySelector('.loading-yy')
//             if (loading) {
//                 loading.style.display = 'none'
//             }
//         }, 2000)
//         document.body.style.overflow = 'auto'
//     })
// }
