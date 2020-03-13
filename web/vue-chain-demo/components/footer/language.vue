<template>
    <a-dropdown :trigger="['click']" overlayClassName="language_div" placement="bottomCenter">
        <a class="ant-dropdown-link-language" href="#">
            {{$t('name')}} <a-icon type="down"></a-icon>
        </a>
        <a-menu slot="overlay" @click="e => $i18n.Lang(e.key)">
            <a-menu-item key="zh_CN">简体中文</a-menu-item>
            <a-menu-item key="en">English</a-menu-item>
        </a-menu>
    </a-dropdown>
</template>
<style lang="less">
    .ant-dropdown-link-language{
        font-size: 14px;
        color: #fff;
        display: inline-block;
        line-height: 40px;
    }
    .language_div .ant-dropdown-menu{
        background: rgba(0,0,0,.7);
        .ant-dropdown-menu-item,
        .ant-dropdown-menu-submenu-title{
            color: #bbb;
        }
        .ant-dropdown-menu-item-active{
            background: rgba(0,0,0,.9);
        }
    }
</style>
