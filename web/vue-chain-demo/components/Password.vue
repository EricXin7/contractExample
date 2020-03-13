<template>
    <a-input
        v-on="$listeners"
        v-bind="$attrs"
        :value="currValue"
        :type="type"
        class="password-component"
        autocomplete="off"
        @change="change"
    >
        <template slot="addonBefore">
            <input type="text" autocomplete="on" tabindex="999"/>
            <input type="password" autocomplete="on" tabindex="1000"/>
        </template>
        <button type="button" slot="addonAfter" @click="toggleType" class="tcenter btn-show cursor">
            <i class="iconfont big20 block" :class="iconclass"></i>
        </button>
    </a-input>
</template>
<script>
    export default {
        name: 'password',
        props: ['value'],
        data () {
            return {
                currValue: this.value,
                type: 'password'
            }
        },
        watch: {
            value (val) {
                this.currValue = val
            }
        },
        computed: {
            iconclass() {
              return this.type == 'text' ? 'icon-eye-close' : 'icon-yanjing'
            }
        },
        methods: {
            change (e) {
                this.currValue = e.target.value || ''
                this.$emit('change', this.currValue);
            },
            toggleType () {
                this.type = this.type == 'text' ? 'password' : 'text'
            }
        }
    }
</script>
<style lang="less">
    .password-component.ant-input-group-wrapper{
        .ant-input.password-component{
            padding-right: 52px;
        }
        .ant-input-wrapper{
            position: relative;
        }
        .ant-input-group-addon{
            background: transparent;
            &:first-child{
                position: absolute; border: 0!important; opacity: 0!important;
                width: 0!important; height: 0!important; overflow: hidden!important;
                input{ width: 0!important; height: 0!important; }
            }
            &:last-child{
                position: absolute; right: 1px; top: 1px; bottom: 1px;
                padding: 0; border: 0; z-index: 1;
                width: 50px;
                line-height: inherit;
                .btn-show{
                  border: 0; height: 99%; width: 99%;
                  background: transparent;
                  outline: none; color: #666;
                }
            }
        }
    }
</style>

