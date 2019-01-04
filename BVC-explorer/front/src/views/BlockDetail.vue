<template>
    <div class="main">
        <Breadcrumb class="breadcrumb" separator=">">
            <BreadcrumbItem to="/">{{$t('menu.home')}}</BreadcrumbItem>
            <BreadcrumbItem to="/hash">{{$t('block.tit2')}}</BreadcrumbItem>            
        </Breadcrumb>
        <div class="info">
            <div class="tit">{{$t('block.tit')}}： <span class="err">{{$route.query.block}}</span> </div>
            <div class="body">
                <table>
                    <tr>
                        <td>
                            <span>{{$t('block.info')[0]}}</span>
                            <span>{{info.transactions_count}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('block.info')[1]}}</span>
                            <span>{{info.ledger_index}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('block.info')[2]}}</span>
                            <span>{{ getime(info.close_time) }}</span>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td>
                            <span :title="$t('block.info')[3]">{{$t('block.info')[3]}}</span>
                            <span :title="info.ledger_hash">{{info.ledger_hash}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span :title="$t('block.info')[4]">{{$t('block.info')[4]}}</span>
                            <span :title="info.transaction_hash">{{info.transaction_hash}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span :title="$t('block.info')[5]">{{$t('block.info')[5]}}</span>
                            <span :title="info.parent_ledger_hash" @click="parentLedger" class="err">{{info.parent_ledger_hash}}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="titlebar" style="padding-left:20px;">
            <div class="h3">{{$t('CADT.tit2')}}</div>
        </div>
        <div class="historylist">            
            <Table :columns="thead" :data="data" size="large" :no-data-text="$t('nodata')" :loading="loading"></Table>          
        </div>
    </div>
</template>

<script>
import {Table,Button,Breadcrumb,BreadcrumbItem,RadioGroup,Radio} from 'iview'
import api from '../common/api'
import dayjs from 'dayjs'
export default {
    name:'TokenHistory',
    components:{
        Table,Button,Breadcrumb,BreadcrumbItem,RadioGroup,Radio
    },
    data(){
        return {
                loading:false,
                limit:50,
                curpage:1,
                ismore:false,
                info:{},
                thead: [
                    {
                        title: this.$t('block.head2')[0],
                        key: 'hash',
                        width:350,
                        render:(h,param) => {
                            return h('router-link',{
                                style:'color:#e4526d',
                                props:{
                                to:'/hash?hash=' + param.row.hash
                                },
                            },
                            param.row.hash.substring(0,35) + '...'
                            )
                        } 
                    },
                    {
                        title: this.$t('block.head2')[1],
                        key: 'account',
                        align:'center',
                        width:350,
                        render:(h,param) => {
                            return h('router-link',{
                                style:'color:#e4526d',
                                props:{
                                to:'/account?address=' + param.row.account
                                },
                            },
                            param.row.account
                            )
                        } 
                    },
                    {
                        title: this.$t('block.head2')[2],
                        key: 'type',
                        align:'center',
                        width:150,
                    },
                    {
                        title: this.$t('block.head2')[3],
                        key: 'time',
                        align:'right',
                        render:(h,params) => {
                            return h('div',[
                                h('span',params.row.time ),
                                h('br'),
                                h('span', this.$t('fee') + ' ' + params.row.fee)
                            ])
                        } 
                    }
                ],
            data:[],
        }
    },
    created(){
        this.ledgers(this.$route.query.block)
        this.transactions(this.$route.query.block)
    },
    watch:{
        '$route.query.block' (){
            this.transactions(this.$route.query.block,true)
            this.ledgers(this.$route.query.block)
        }
    },

    mounted(){
    },
    methods:{
        transactions(val,clear){
            clear && (this.data = [])
            this.loading = true
            this.$axios(`${api.transactions}?ledger=${val}&page=${this.curpage}&limit=${this.limit}`).then( res => {
                const list = res.data.transactons
                if(list.length > 0){
                    list.map(data => {
                        this.data.push({
                            hash:data.hash,
                            type: data.type == 'Payment' ? this.$t('Payment') : data.type == 'OfferCreate' ? this.$t('OfferCreate') : data.type == 'OfferCancel' ? this.$t('OfferCancel') : data.type == 'AccountSet' ? this.$t('AccountSet') : data.type == 'TrustSet' ? this.$t('TrustSet') : this.$t('other'),
                            account:data.account,
                            fee:data.fee,
                            time:dayjs(data.time).format('YYYY-MM-DD HH:mm:ss') ,
                        })
                    })
                }             
                this.loading = false
            }).catch(err => {
                // console.log(err)
            })
        },
        loadMore(){
            this.curpage++ 
            this.transactions()
        },

        ledgers(val){
            if(val){
                this.$axios(`${api.ledgers}/${val}`).then( res => {                
                    this.info = res.data.ledger
                }).catch(err => {
                    this.$router.push('/err?err=block')
                })
            }else{
                this.$router.push('/err?err=block')
            }
            
        },
        parentLedger(){
            this.$router.push('/blockdetail?block=' + (this.$route.query.block - 1))
        },
        getime(val){            
            return val && dayjs( val * 1000).format('YYYY-MM-DD HH:mm:ss')            
        }
    }

}
</script>

<style lang="less" scoped>
@import '../assets/css/var.less';
.info{    
    .box();     
    margin:20px 0;
    .tit{padding:0 20px;background:#F5F5F5;line-height:40px;font-weight: bold;}
    .body{
        overflow: hidden;   
        padding:5px 20px;
        table{
            width:35%;
            float: left;
            &:nth-child(2){
                float: right;
                // display:block;
                width:63%;
                td{
                    span:first-child{
                        width: 20%;
                        display:block;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    span:nth-child(2){
                        width: 80%;
                        display:block;
                        text-align: right;
                        position: relative;
                        right:0;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        &.err{
                            cursor: pointer;
                        }
                    }
                }
            }
            tr{
                width: 100%;
                td{
                    border-bottom: 1px solid #ddd;
                    line-height:40px;
                    overflow: hidden;
                    span{
                        float: left;
                        &:last-child{
                            float:right;
                            
                        }
                    }                  
                }
                &:last-child{
                    td{border:none;}
                }
            }
        }
    }
}
.historylist{
    .box();
    .tab{
        padding:10px;
    }
}
.more{
    text-align: center;
    padding:30px 0;
}
</style>
