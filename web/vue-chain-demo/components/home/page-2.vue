<template>
    <div class="page-2-component">
        <div class="title layout1200 tcenter">
            {{$t('t039')}}
        </div>
        <div class="layout1200">
            <a-spin :spinning="spinning">
                <a-row :gutter="30" style="min-height: 252px">
                    <a-col :span="5" v-for="i in goods" :key="i.code">
                        <div class="item relative">
                            <div class="thumb tcenter">
                                {{i.name}}
                            </div>
                            <div class="detail">
                                <div class="reamrk tcenter">
                                    {{$t('t034')}}{{i.buyNum}}{{$t('t040')}}
                                </div>
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </a-spin>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'page-2',
        data () {
            return {
                goods: [],
                spinning: false
            }
        },
        created() {
            this.getlist()
            this.$bus.$on('refreshMy', this.getMylist)
        },
        methods: {
            getlist() {
                this.spinning = true
                this.$axios.$get('/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/market/goods"').then(data => {
                    this.goods = (data || []).map(i => {
                        return {
                            ...i,
                            buyNum: 0
                        }
                    })
                    this.getMylist()
                })
            },
            getMylist() {
                let address = this.$store.state.Authorization
                if (!address) {
                    return
                }
                this.spinning = true
                this.$axios.$get('/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/market/records/'+ address +'"').then(data => {
                    this.goods = this.goods.map(i => {
                        return {
                            ...i,
                            buyNum: 0
                        }
                    });
                    (data || []).forEach(i => {
                        let good = this.goods.find(a => a.code == i.goodsCode)
                        if (good) {
                            good.buyNum += i.buyNum
                        }
                    })
                    this.spinning = false
                })
            }
        },
        beforeDestroy() {
            this.$bus.$off('refreshMy')
        }
    }
</script>
<style lang="less">
    @import '~@/assets/css/webkit.less';
    .page-2-component{
        padding-bottom: 60px;
        .title{
            font-size: 32px;
            padding: 40px 0 80px;
            color: #000;
        }
        .ant-col-5{
            width: 20%;
        }
        .item{
            position: relative;
            background: #FFFFFF;
            border: 1px solid #CCD1FF;
            box-shadow: 0 2px 4px 0 #D1D5FF;
            border-radius: 4px;
            .thumb{
                font-size: 34px;
                text-align: center;
                background: #F3F4FF;
                height: 176px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .detail{
                padding: 15px;
                line-height: 2.5;
                font-size: 18px;
                color: #000;
            }
        }
    }
</style>
