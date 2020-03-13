/* eslint-disable nuxt/no-cjs-in-config */
const { resolve } = require('path')
module.exports = {
    mode: 'spa', // universal
    /*
     ** Headers of the page
     */
    router: {
        middleware: 'check-auth',
        // mode: 'hash',
        extendRoutes(routes) {
            routes.push({
                path: '/',
                redirect: '/buy'
            })
        }
    },
    head: {
        title: '',
        meta: [
            {
                charset: 'utf-8'
            },
            {
                hid: 'description',
                name: 'description',
                content: '游戏，区块链'
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            }
        ]
    },
    env: {
        wss: ''
    },
    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#0fa166'
    },

    /*
     ** Global CSS
     */
    css: [{ src: 'ant-design-vue/dist/antd.less', lang: 'less' }, 'animate.css/animate.css', '~assets/css/public.less'],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: ['~plugins/i18n', '~plugins/axios', '~plugins/antd-ui', '~plugins/bus', '~plugins/wallet', '~utils/filter', '~utils/math', '~plugins/avatar', '@/plugins/svg', '@/plugins/router'],

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios'
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        proxy: true,
        // Base URL which is used and prepended to make requests in server side.
        baseURL: 'https://test-earth.bcbchain.io',
        // Default: baseURL (or prefix when options.proxy is enabled)
        prefix: ''
    },

    proxy: {
        '/abci_query': 'https://test-earth.bcbchain.io'
    },
    /*
     ** Build configuration
     */
    build: {
        extend(config, ctx) {
            const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
            svgRule.exclude = [resolve(__dirname, 'assets/svgs')]

            // Includes /assets/icons/svg for svg-sprite-loader
            config.module.rules.push({
                test: /\.svg$/,
                include: [resolve(__dirname, 'assets/svgs')],
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon-[name]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            svgo: {
                                plugins: [
                                    {
                                        removeAttrs: {
                                            // attrs: 'path:(fill|opacity)'
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            })
        },
        loaders: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    'blue-color': '#2042DF'
                }
            }
        },
        babel: {
            plugins: [
                [
                    'import',
                    {
                        libraryName: 'ant-design-vue'
                        // libraryDirectory: 'es',
                        // style: true
                    }
                ]
            ]
        },
        cssSourceMap: false,
        filenames: {
            chunk: ({ isDev }) => (isDev ? '[name].js' : '[name].[chunkhash].js')
        },
        analyze: false
    }
}
