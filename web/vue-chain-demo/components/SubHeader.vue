<template>
    <div class="sub-header">
        <div class="mobile-header flex acenter">
            <div class="sidebar_div flex_1">
                <logo></logo>
            </div>
            <div class="user-center">
                <a-button class="menu-btn" @click="show_dia_menu = true"></a-button>
            </div>
        </div>
        <div class="sub-header-component flex acenter">
            <div class="sidebar_div flex acenter">
                <logo></logo>
            </div>
            <div class="flex_1 main-div">
                <dl class="el-menu">
                    <dd class="el-menu-item">
                        <nuxt-link to="/buy" class="title-wrapper">Token购买</nuxt-link>
                    </dd>
                    <dd class="el-menu-item">
                        <nuxt-link to="/use" class="title-wrapper">Token使用</nuxt-link>
                    </dd>
                </dl>
            </div>
            <div class="user-center">
                <a-button class="login-btn" v-if="!address" @click="$wallet.isLogin"><a-icon type="user"></a-icon>{{$t('menu.denglu')}}</a-button>
                <span class="user-info" v-else>
                    <svg-icon icon-class="用户"></svg-icon> {{$t('menu.wodezhanghao')}}：{{address | address}}
                </span>
                <language class="language-outer"></language>
            </div>
        </div>
    </div>
</template>
<script>
    import language from '~/components/footer/language.vue';
    import Logo from '~/components/Logo.vue';
    export default {
        props: ['layouts'],
        data () {
            return {
                showmenu: false,
                show_dia_menu: false,
                gameType: 1
            }
        },
        components: {
            language, Logo
        },
        computed: {
            address() {
                return this.$store.state.Authorization
            }
        },
        created () {
            this.refreshWallet()
            // 钱包登录或者退出时监听事件
            this.$bus.$on('wallet-accound-change', () => {
                this.refreshWallet()
            })
        },
        methods: {
            refreshWallet() {
                let wallet = this.$wallet.selectedAccount()
                if (wallet) {
                    // 更新钱包信息
                    this.$store.dispatch('updateWallet')
                }
            }
        }
    }
</script>
<style lang="less">
    @import '~@/assets/css/var.less';
    .mobile-header{
        background: #5361F6;
        display: none;
    }
    .sub-header-component {
        background: #5361F6;
        height: 48px;
        padding: 0 20px 0 40px;
        .logo{
            height: 28px; margin: 0 40px 0 0
        }
        .txt-button{
            border: 0;
            background: transparent;
            color: #fff;
        }
        .user-center{
            color: #fff;
            .svg-icon{
                vertical-align: -1px;
                margin-right: 5px;
                color: #fff;
            }
        }
        .login-btn{
            color: #fff;
            height: 34px;
            border: 0;
            font-size: 16px;
            background: #5361F6
        }
        .language-outer{
            margin-left: 20px;
        }
        .main-div{
            position: relative;
            height: 40px;
            .el-menu{
                position: relative; z-index: 2;
                display: block;
                border: 0;
                line-height: 40px;
                background: transparent;
                color: #fff;
                font-size: 16px;
                margin: 0;
                height: 40px;
                .el-menu-item{
                    display: inline-block;
                    white-space: nowrap;
                    position: relative;
                    margin: 0;
                    padding: 0 15px;
                    .title-wrapper{
                        color: #fff;
                    }
                    .title-wrapper{
                        cursor: pointer;
                    }
                    .nuxt-link-active{
                        font-weight: 700
                    }
                }
            }
        }
    }
</style>
