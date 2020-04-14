<template>
    <div class="page-1-component">
        <div class="title tcenter">
            {{$t('t032')}}
        </div>
        <div class="layout1200 list">
            <a-spin :spinning="spinning">
                <a-row :gutter="30" style="min-height: 405px">
                    <a-col :span="5" v-for="i in goods" :key="i.code">
                        <div class="item relative">
                            <div class="thumb tcenter">
                                {{i.name}}
                            </div>
                            <div class="detail">
                                <div class="flex acenter">
                                    <div class="rtitle">{{$t('t034')}}</div>
                                    <div class="input">{{i.repertory}}</div>
                                </div>
                                <div class="flex acenter">
                                    <div class="rtitle">{{$t('t035')}}</div>
                                    <div class="input"><a-input v-model="i.buyNum" :disabled="i.repertory <= 0"></a-input></div>
                                </div>
                                <div class="flex acenter">
                                    <div class="rtitle">{{$t('t033')}}</div>
                                    <div class="input">
                                        <select v-model="i.currency">
                                            <option value="0" label="BCB"></option>
                                            <option value="1" label="demo"></option>
                                        </select>
                                    </div>
                                </div>
                                 <div class="flex acenter">
                                    <div class="rtitle">{{$t('t053')}}</div>
                                    <div class="input" v-if="i.currency == '1'">{{i.price | thousands}}<span>demo</span></div>
                                    <div class="input" v-if="i.currency == '0'">{{i.bcb_price | thousands}}<span>BCB</span></div>
                                </div>
                                <div class="flex acenter">
                                    <div class="rtitle">{{$t('t036')}}</div>
                                    <div class="input" v-if="i.currency == '1'">{{i.buyNum * i.price}}<span>demo</span></div>
                                    <div class="input" v-if="i.currency == '0'">{{i.buyNum * i.bcb_price }}<span>BCB</span></div>
                                </div>
                            </div>
                            <div class="footer">
                                <a-button type="primary" @click="buy(i)" :loading="i.loading" :disabled="i.buyNum > i.repertory || !i.buyNum" class="w100">{{$t('t037')}}</a-button>
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
        name: 'page-1',
        data () {
            return {
                goods: [],
                spinning: false
            }
        },
        computed: {
            address() {
                return this.$store.state.Authorization
            }
        },
        watch: {
            address() {
                this.$bus.$emit('refreshMy')
            }
        },
        created() {
            this.getlist()
        },
        methods: {
            getlist() {
                this.spinning = true
                this.$axios.$get('/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/market/goods"').then(data => {
                    this.goods = (data || []).map(i => {
                        return {
                            ...i,
                            buyNum: 0,
                            currency: 0,
                            loading: false
                        }
                    })
                    this.spinning = false
                })
            },
            buy(form) {
                let total = this.$math.Mul(form.buyNum, form.currency == '0'?form.bcb_price:form.price)
                let contract = form.currency == '0'? 'bcbt3ScZC4SzPKEHZDYHe7Xsydu6PKoCxzV8g': 'bcbtJ4zVVdGeVNNhBNYRNzoYAvDyyZdtwcDXS'
                form.loading = true
                this.$wallet.action({
                    'note': 'market buy',
                    'gasLimit': '25000',
                    'calls': [
                        {
                            'contract': contract,
                            'method': 'Transfer(types.Address,bn.Number)',
                            'params': ['bcbt4GNptjD3mhPdXSwvn8ih51qNe8jD25sRg', total]
                        },
                        {
                            'contract': 'bcbt4GNptjD3mhPdXSwvn8ih51qNe8jD25sRg',
                            'method': 'Buy(string)',
                            'params': [form.code]
                        }]
                }).then(hash => {
                    if (hash) {
                        this.$message.success(this.$t('t038'))
                        this.$bus.$emit('refreshMy')
                        this.getlist()
                    }
                    form.loading = false
                })
            }
        }
    }
</script>
<style lang="less">
    @import '~@/assets/css/webkit.less';
    .page-1-component{
        min-height: 659px;
        .title{
            background: #4353FF;
            font-size: 30px;
            padding: 111px 0 144px;
            color: #fff;
        }
        .list{
            margin-top: -100px;
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
                .rtitle{
                    white-space: nowrap;
                    min-width: 70px;
                }
                .ant-input{
                    height: 40px;
                    color: #333;
                    .placeholder();
                }
            }
            .footer{
                padding: 10px 15px;
                border-top: 1px solid #DAD9D9;
                .ant-btn{
                    background: #5AC675!important;
                    border: 0!important;
                }
            }
        }
    }
</style>
