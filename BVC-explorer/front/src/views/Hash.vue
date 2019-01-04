<template>
    <div class="main">
        <Breadcrumb class="breadcrumb" separator=">">
            <BreadcrumbItem to="/">{{$t('menu.home')}}</BreadcrumbItem>
            <BreadcrumbItem to="/hash">{{$t('hash.tit')}}</BreadcrumbItem>            
        </Breadcrumb>
        <div class="info">
            <div class="tit">{{$t('hash.tit')}}： {{$route.query.hash}} </div>
            <div class="body">
                <table>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[0]}}</span>
                            <span>{{info.type == 'Payment' ? this.$t('Payment') : info.type == 'OfferCreate' ? this.$t('OfferCreate') : info.type == 'OfferCancel' ? this.$t('OfferCancel') : info.type == 'AccountSet' ? this.$t('AccountSet') : info.type == 'TrustSet' ? this.$t('TrustSet') : this.$t('other')}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[1]}}</span>
                            <span class="err" @click="$router.push(`/account?address=${info.account}`)" style="cursor: pointer;">{{info.account}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[2]}}</span>
                            <span v-if="info.destination" class="err" @click="$router.push(`/account?address=${info.destination}`)" style="cursor: pointer;">{{info.destination}}</span>
                            <span v-else>--</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[3]}}</span>
                            <span>{{info.ledger}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[8]}}</span>
                            <span>
                                <template v-for=" item in info.simple_memos">
                                    {{item.memo_data }} 
                                </template>
                                {{!info.simple_memos ? '--' : ''}}
                            </span>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[4]}}</span>
                            <span v-html="info.result == 'tesSUCCESS' ? `<span class = \'success\' >${$t('success')}</span>` :`<span class=\'error\'>${$t('error')}</span>` "></span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{info.type == 'AccountSet' ? $t('hash.text')[0] : info.type == 'TrustSet' ? $t('hash.text')[1] : $t('hash.list')[5]}}   </span>
                            <span>{{info.amount}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[6]}}</span>
                            <span>{{info.fee}} BVC</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{{$t('hash.list')[7]}}</span>
                            <span>{{info.time}}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="titlebar">
            <div class="h3" style="font-size:14px">{{$t('hash.tit2')}}</div>
        </div>
        <div class="result">
            <template v-if="info.txResults && info.txResults.length">
                <p v-for="(item,index) in info.txResults" :key="index">
                    {{item}}
                </p>
            </template>
            <span v-if="info.txResults && !info.txResults.length">
                {{$t('nothing')}}
            </span>
        </div>
    </div>
</template>

<script>
import {Table,Button,Breadcrumb,BreadcrumbItem,RadioGroup,Radio,Tag} from 'iview'
import api from '../common/api'
import dayjs from 'dayjs';
export default {
    name:'TokenHistory',
    components:{
        Table,Button,Breadcrumb,BreadcrumbItem,RadioGroup,Radio,Tag
    },
    data(){
        return {
            loading:false,
            info:{}
        }
    },
    created(){
        this.transactions()
    },
    mounted(){
    },
    computed:{
        
    },
    watch:{
        '$route.query.hash' (){
            this.transactions()
        }
    },
    methods:{
        transactions(){
            this.loading = true
            this.$axios(`${api.transactions}/${this.$route.query.hash}`).then( res => {
                this.info = res.data
                this.info['time'] = dayjs(res.data.time).format('YYYY-MM-DD HH:mm:ss')
                this.loading = false
            }).catch(err => {
                this.$router.push('/err?err=hash')
            })
        },
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
        padding:30px 20px 45px 20px;
        table{
            width:45%;
            float: left;
            &:nth-child(2){
                margin-left:10%;
            }
            tr{
                td{
                    border-bottom: 1px solid #dfdfdf;
                    line-height:50px;
                    overflow: hidden;
                    span{
                        float: left;
                        &:last-child{
                            float:right;
                        }
                    }                  
                }
                &:last-child{
                    // td{border:none;}                    
                }
            }            
        }
    }
}
.result{
    .box();
    padding:20px;
    border-left:2px solid @mainColor1;
}

</style>
