<template>
    <div class="main">
        <Breadcrumb class="breadcrumb" separator=">">
            <BreadcrumbItem to="/">{{$t('menu.home')}}</BreadcrumbItem>
            <BreadcrumbItem to="/hash">{{$t('account.tit')}}</BreadcrumbItem>            
        </Breadcrumb>
        <div class="accountinfo">
            <div class="address">{{$t('account.tit')}}：{{addr}}
                <Tooltip :content="$t('qr')" placement="top"><i class="iconfont icon-erweima" @click="qr = true"></i></Tooltip>
                <Tooltip :content="$t('copy')" placement="top"><i class="iconfont icon-fuzhi" 
                v-clipboard:copy="addr"
                v-clipboard:success="copysuc"
                v-clipboard:error="copyerr"
                ></i></Tooltip>
            </div> 
            <div>
                <ul class='balance'>
                    <li v-for="(item,index) in balancesList" :key="index">
                        {{item.currency}} {{$t('account.balance')}}：<span class="err" style="font-weight:bold;">{{item.value}}</span> 
                        <span class="err" style="margin-left:10px">{{item.counterparty ? `(${item.counterparty})`:''}}</span>
                    </li>
                </ul>
                <!-- <table width="100%">
                    <template  >
                        <template v-if=" (index % 2) == 0 ">
                            <tr :key="index">
                                <td width='50%'>                            
                                    
                                </td>
                        </template>

                    </template>                                     
                </table> -->

            </div>
        </div>
        <div class="accountlist">
            <Table :columns="thead" :data="data" size="small" :no-data-text="$t('nodata')" :loading="loading"></Table>            
        </div>
        <div class="more" v-if="ismore">
            <Button type="primary" ghost @click="loadMore">{{$t('more')}}</Button>
        </div>
        <Modal
            :title="$t('account.tit')"
            footer-hide
            v-model="qr"
            class-name="vertical-center-modal">
            <div style="text-align:center;margin-left:30px;">
                <vue-qr :text="addr" :logoSrc="logoSrc" colorDark="#e4526d" :size="300"></vue-qr>
            </div>
        </Modal>
    </div>
</template>

<script>
import {Table,Button,Breadcrumb,BreadcrumbItem,Modal,Tooltip,Select,Option} from 'iview'
import api from '../common/api'
import VueQr from 'vue-qr'
import dayjs from 'dayjs'
export default {
    name:'Account',
    components:{
        Table,Button,Breadcrumb,BreadcrumbItem,Modal,VueQr,Tooltip,Select,Option
    },
    data(){
        return {
            loading:false,
            limit:15,
            curpage:1,
            marker:'',
            ismore:false,
            qr:false,
            addr:this.$route.query.address,
            logoSrc:require('../assets/images/logo.png'),
            choose:'',
            balancesList:[],
            thead: [{
                title: this.$t('home.head2')[0],
                key: 'hash',
                render:(h,param) => {
                    return h('router-link',{
                        style:'color:#e4526d',
                        props:{
                        to:'/hash?hash=' + param.row.hash
                        },
                    },
                    param.row.hash.substring(0,55) + '...'
                    )
                } 
            },
            {
                title: this.$t('home.head2')[1],
                key: 'type',
                width:150,
                align:'center'
            },
            {
                title: this.$t('home.head2')[2],
                key: 'count',
                align:'right',
                width:250,  
            },
            {
                title: this.$t('home.head2')[3],
                key: 'time',
                align:'right',
                width:200,
            }],
            data:[],
        }
    },
    created(){
        this.accounts()
        this.balances()
    },
    watch:{
        '$route.query.address' (){
            this.accounts()
            this.balances()
        }
    },
    methods:{
        copysuc(e){
            this.$Message.success(this.$t('copysuc'))
        },
        copyerr(e){
            this.$Message.error(this.$t('copyerr'))
        },
        balances(){
            this.$axios(`${api.balances}/${this.$route.query.address}`).then( res => {
                this.balancesList = res.data.balances
            }).catch(err => {                
                this.$router.push('/err?err=account')
            })
        },
        accounts(){
            this.loading = true
            this.$axios(`${api.accounts}/${this.$route.query.address}/transactions?marker=${this.marker}&limit=${this.limit}`).then( res => {
                const list = res.data.transactons
                if(list.length > 0){
                    list.map(data => {
                        this.data.push({
                            hash:data.hash,
                            type: data.type == 'Payment' ? this.$t('Payment') : data.type == 'OfferCreate' ? this.$t('OfferCreate') : data.type == 'OfferCancel' ? this.$t('OfferCancel') : data.type == 'AccountSet' ? this.$t('AccountSet') : data.type == 'TrustSet' ? this.$t('TrustSet') : this.$t('other'),
                            count:data.amount,
                            time:dayjs(data.time).format('YYYY-MM-DD HH:mm:ss') ,
                        })
                    })
                }
                // if(res.data.total > (this.limit * this.curpage) ){
                //     this.ismore = true
                // }else{
                //     this.ismore = false
                // }                
                this.ismore = res.data.marker ? true : false
                this.marker = res.data.marker 
                this.loading = false
            }).catch(err => {
                // console.log('err')
            })
        },
        loadMore(){
            this.curpage++ 
            this.accounts()
        }
    },

}
</script>

<style lang="less" scoped>
@import '../assets/css/var.less';

.accountinfo{
    .box();
    padding:10px 20px;
    margin-bottom:20px;
    overflow: hidden;
    .iconfont{
        font-size:20px;
        cursor: pointer;
        color:@txtColor2;
        padding:5px;
        &:hover{
            background:@mainbg;
            border-radius:50%;
        }
    }
    .balance{
        li{
            float: left;
            width:50%;
            list-style:none;
            line-height:30px;
        }
    }
    .address{
        border-bottom: 1px solid #DDDCDC;
        margin-bottom:8px;
        padding-bottom:8px;
    }
    .rinfo, .linfo{
        list-style:none;
        display: inline-block;
        width:50%;        
    }
    .rinfo{
        text-align:right;
        .select{text-align: left;margin-left:20px;}     
    }

}
.accountlist{
    .box();        
}
.more{
    text-align: center;
    padding:30px 0;
}
</style>
