<template>
    <div class="page-3-component">
        <div class="title layout1200 tcenter">
            {{$t('t041')}}
        </div>
        <div class="layout1200 tableouter">
            <a-spin :spinning="spinning">
                <a-table
                    :columns="columns"
                    :rowKey="record => record.id"
                    :dataSource="dataTable"
                    bordered
                ></a-table>
            </a-spin>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'page-3',
        data () {
            return {
                dataTable: [],
                spinning: false
            }
        },
        computed: {
            columns() {
                return [
                    { title: this.$t('t042'), dataIndex: 'id', key: 'id' },
                    { title: this.$t('t043'), dataIndex: 'time', key: 'time' },
                    { title: this.$t('t044'), dataIndex: 'address', key: 'address' },
                    { title: this.$t('t045'), dataIndex: 'goodsCode', key: 'goodsCode' },
                    { title: this.$t('t046'), dataIndex: 'goodsPrice', key: 'goodsPrice' },
                    { title: this.$t('t047'), dataIndex: 'buyNum', key: 'buyNum' },
                    { title: this.$t('t048'), dataIndex: 'used', key: 'used' }
                ]
            }
        },
        created() {
            this.getlist()
            this.$bus.$on('refreshMy', this.getlist)
        },
        methods: {
            getlist() {
                let address = this.$store.state.Authorization
                if (!address) {
                    return
                }
                this.spinning = true
                this.$axios.$get('/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/market/records/'+ address +'"').then(data => {
                    this.dataTable = data
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
    .page-3-component{
        background: #F6F7FB;
        margin-bottom: 30px;
        .title{
            font-size: 30px;
            padding: 40px 0;
            color: #000;
        }
        .tableouter{
            background: #FFFFFF;
            box-shadow: 0 1px 6px 0 rgba(159,159,159,0.50);
            padding: 70px 30px 10px;
        }
        .ant-table-tbody > tr > td{
            background: #fff;
        }
    }
</style>
