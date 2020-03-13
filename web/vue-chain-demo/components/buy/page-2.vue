<template>
    <div class="buy-page-2-component">
        <div class="title layout1200 tcenter">
            {{$t('t009')}}
        </div>
        <div class="layout1200">
            <a-row :gutter="30">
                <a-col :span="6">
                    <div class="rtitle">{{$t('t010')}}</div>
                    <a-form>
                        <a-form-item
                            :label="$t('t011')"
                            :label-col="{ span: 10 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col1.totalSupply | thousands}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t012')"
                            :label-col="{ span: 10 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">--</span>
                        </a-form-item>
                        <a-form-item
                            label="gasPrice"
                            :label-col="{ span: 10 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col1.gasprice | thousands}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t013')"
                            :label-col="{ span: 10 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col1.addSupplyEnabled ? $t('t015') : $t('t016')}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t014')"
                            :label-col="{ span: 10 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col1.burnEnabled ? $t('t015') : $t('t016')}}</span>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="10">
                    <div class="rtitle">{{$t('t017')}}</div>
                    <a-form>
                        <a-form-item
                            :label="$t('t018')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">bcbtTsQ3cCrAuCuRpBrwaHWVVAXNPvJQyYb9</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t019')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col1.owner}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t020')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col2.startDate}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t021')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">9</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t022')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <a class="span" :href="$t('t023')" target="_blank">{{$t('t023')}}</a>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t024')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <a class="span" :href="$t('t025')" target="_blank">{{$t('t025')}}</a>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t026')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">-</span>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="8">
                    <div class="rtitle">{{$t('t027')}}</div>
                    <a-form>
                        <a-form-item
                            :label="$t('t028')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col2.fundingGoal | thousands}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t029')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col2.startDate}}—{{col2.endDate}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t030')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col2.soft | thousands}}</span>
                        </a-form-item>
                        <a-form-item
                            :label="$t('t031')"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 12 }"
                        >
                            <span class="span">{{col2.hard | thousands}}</span>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'buy-page-2',
        data() {
            return {
                col1: {},
                col2: {}
            }
        },
        mounted() {
            this.getInfo()
        },
        methods: {
            getInfo() {
                this.$axios.$get('/abci_query?path="/token/bcbtJ4zVVdGeVNNhBNYRNzoYAvDyyZdtwcDXS"').then(info => {
                    this.col1 = info || {}
                })
                this.$axios.$get('/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/ico/round"').then(info => {
                    this.col2 = info || {}
                })
            }
        }
    }
</script>
<style lang="less">
    @import '~@/assets/css/webkit.less';
    .buy-page-2-component{
        padding-bottom: 60px;
        .title{
            font-size: 32px;
            padding: 40px 0 80px;
            color: #000;
        }
        .ant-form-item-label{
            text-align: left;
        }
    }
</style>
