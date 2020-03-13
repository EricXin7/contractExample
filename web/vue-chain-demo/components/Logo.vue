<template>
    <nuxt-link to="/buy" class="logo-comp">
        Demo
    </nuxt-link>
</template>
<script>
    export default {
        name: 'logo',
        computed: {
            brandinfo() {
                return this.$store.state.brandinfo
            }
        }
    }
</script>
<style lang="less">
    .logo-comp{
        font-size: 35px; color: #fff;
        display: inline-block;
        height: 40px;
        line-height: 34px;
        padding-right: 40px;
    }
</style>
