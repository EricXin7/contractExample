<template>
    <a-locale-provider :locale="locale">
        <a-layout class="default-layout">
            <div class="header">
                <sub-header layouts="toggle"></sub-header>
            </div>
            <a-layout class="bodyer flex" :class="menuDirectionClass">
                <a-layout-content class="default-content flex_1">
                    <nuxt></nuxt>
                </a-layout-content>
            </a-layout>
            <div class="footer">
                <sub-footer></sub-footer>
            </div>
        </a-layout>
    </a-locale-provider>
</template>
<script>
    import SubHeader from '~/components/SubHeader.vue';
    import SubFooter from '~/components/Footer.vue';
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
    import enUS from 'ant-design-vue/lib/locale-provider/en_US';
    export default {
        name: 'default',
        head() {
            return {
                title: 'Demo'
            }
        },
        components: {
            SubHeader, SubFooter
        },
        computed: {
            opened () {
                return this.$store.state.config.opened
            },
            device () {
                return this.$store.state.config.device
            },
            locale() {
                return this.$store.state.locale == 'zh_CN' ? zhCN : enUS
            },
            isShowMobileSidebar() {
                return this.device==='mobile' && this.opened
            },
            sidebarClass() {
                return [this.device, this.opened].join('_')
            },
            menuDirectionClass() {
                return ['menu', this.$store.state.config.menu_dir].join('_')
            }
        },
        methods: {
            handleClickOutside () {
                this.$store.dispatch('config/closeSideBar', { withoutAnimation: false })
            }
        }
    }
</script>

<style lang="less">
    @import '~@/assets/css/default.less';
    @import '~@/assets/css/module/buttons.less';

    .default-layout {
        .ant-layout{
            background: #fff;
        }
        .default-content{
            overflow: auto;
        }
        .drawer-bg {
            background: #000;
            opacity: 0.3;
            width: 100%;
            top: 0;
            height: 100%;
            position: absolute;
            z-index: 999;
        }
        .sidebar{
            transition: right .3s;
            margin-top: 10px;
        }
        .mobile_false{
            position: fixed;
            bottom: 0;
            right: -350px;
            top: 48px;
        }
        .mobile_true{
            position: fixed;
            bottom: 0;
            right: 0;
            top: 48px;
            z-index: 1000;
        }
        .desktop_false{
            display: none;
        }
        .desktop_true{
             display: block;
        }
    }
</style>

