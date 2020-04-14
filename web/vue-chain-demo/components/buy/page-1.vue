<template>
    <div class="buy-page-1-component">
        <div class="title tcenter">
            {{$t('t001')}}
        </div>
        <div class="layout1200 list">
            <a-form
                :form="form"
                @submit="handleSubmit"
            >
                <a-form-item
                    :label="$t('t002')"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 12 }"
                >
                    <span class="span">1 BCB = 10 Demo</span>
                </a-form-item>
                <a-form-item
                    :label="$t('t003')"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 12 }"
                >
                    <a-radio-group v-decorator="['radio', { rules: [{ required: true, message: $t('t004') }] }]">
                        <a-radio value="1">
                            1 BCB
                        </a-radio>
                        <a-radio value="5">
                            5 BCB
                        </a-radio>
                        <a-radio value="10">
                            10 BCB
                        </a-radio>
                        <a-radio value="50">
                            50 BCB
                        </a-radio>
                        <a-radio value="100">
                            100 BCB
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 8 }">
                    <a-button
                        type="primary"
                        html-type="submit"
                        :loading="loading"
                    >
                        {{$t('t005')}}
                    </a-button>
                    <div class="row">
                        {{$t('t006')}}&ensp;<a href="/docx/bcb-wallet-chrome-bcb.zip" target="_blank">{{$t('t007')}}</a>
                    </div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'buy-page-1',
        data () {
            return {
                form: this.$form.createForm(this),
                loading: false
            }
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.loading = true
                        this.$wallet.action( {
                            'note': 'tokensale Exchange',
                            'gasLimit': '25000',
                            'calls': [
                                {
                                    'contract': 'bcbt3ScZC4SzPKEHZDYHe7Xsydu6PKoCxzV8g',
                                    'method': 'Transfer(types.Address,bn.Number)',
                                    'params': ['bcbt62NNaqskogQ9BnM5Te3PFbbzqtibuP1y6', values.radio * 1e9]
                                },
                                {
                                    'contract': 'bcbt62NNaqskogQ9BnM5Te3PFbbzqtibuP1y6',
                                    'method': 'Exchange()',
                                    'params': []
                                }]
                        }).then(hash => {
                            this.loading = false
                            if (hash) {
                                this.$message.success(this.$t('t008'))
                                this.icon()
                            }
                        })
                    }
                });
            },
            icon() {
                this.$wallet.action( {
                    'note': 'tokensale Withdraw',
                    'gasLimit': '25000',
                    'calls': [
                        {
                            'contract': 'bcbtLPy7Bu1mWUhYs6DWHsgojTt5F5MauhVag',
                            'method': 'Withdraw()',
                            'params': []
                        }]
                })
            }
        }
    }
</script>
<style lang="less">
    @import '~@/assets/css/webkit.less';
    .buy-page-1-component {
        min-height: 500px;
        .title {
            font-size: 30px;
            padding: 111px 0 144px;
            color: #000;
        }
        .list {
            margin-top: -100px;
        }
        .item {
            position: relative;
            background: #ffffff;
            border: 1px solid #ccd1ff;
            box-shadow: 0 2px 4px 0 #d1d5ff;
            border-radius: 4px;
            .thumb {
                font-size: 34px;
                text-align: center;
                background: #f3f4ff;
                height: 176px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .detail {
                padding: 15px;
                line-height: 2.5;
                .rtitle {
                    white-space: nowrap;
                }
                .ant-input {
                    height: 40px;
                    color: #333;
                    .placeholder();
                }
            }
            .footer {
                padding: 10px 15px;
                border-top: 1px solid #dad9d9;
                .ant-btn {
                    background: #5ac675 !important;
                    border: 0 !important;
                }
            }
        }
    }
</style>
