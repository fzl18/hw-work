<template>
    <div class="main">
        <!-- <Breadcrumb class="breadcrumb" separator=">">
            <BreadcrumbItem to="/">{{$t('menu.home')}}</BreadcrumbItem>
            <BreadcrumbItem to="/hash">{{$t('CADT.tit')}}</BreadcrumbItem>            
        </Breadcrumb> -->
        <div class="info">
            <table>
            <tr>
              <td width='50' style="padding-left:40px">
                <img :src="info.image" alt="" width="50">
              </td>
              <td width='30'>{{info.currency}}</td>
              <td align="left">{{$t('CADT.addr')}}：{{info.issuer}}</td>
              <td align='right'>{{$t('CADT.total')}}：{{info.total}}</td>
            </tr>
          </table>
          <div class="desc">
              {{info.dec}}
          </div>
        </div>
        <div class="titlebar" style="padding-left:20px;">
            <div class="h3">{{$t('CADT.tit2')}}</div>
        </div>
        <div class="historylist">            
            <Table :columns="thead" :data="data" size="small" :no-data-text="$t('nodata')" :loading="loading"></Table>          
        </div>
        <div class="more" v-if="ismore">
            <Button :loading="loading" @click="loadMore" type="primary" ghost>{{$t('more')}}</Button>
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
            limit:15,
            curpage:1,
            marker:'',
            ismore:false,
            info:{},
            thead: [
                {
                    title: this.$t('home.head2')[0],
                    key: 'hash',
                    render:(h,param) => {
                    return h('router-link',{
                        style:'color:#e4526d',
                        props:{
                        to:'/hash?hash=' + param.row.hash
                        },
                    },
                    param.row.hash
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
                    width:250
                },
                {
                    title: this.$t('home.head2')[3],
                    key: 'time',
                    align:'right',
                    width:200
                }
            ],
            data:[],
        }
    },
    created(){
        this.transactions()
        this.tokenDetail()
    },
    methods:{        
        transactions(){
            this.loading = true
            this.$axios(`${api.transactions}?page=${this.curpage}&limit=${this.limit}&currency=CADT&marker=${this.marker}`).then( res => {
                const list = res.data.transactons
                list.map(data => {
                    this.data.push({
                        hash:data.hash,
                        type: data.type == 'Payment' ? this.$t('Payment') : data.type == 'OfferCreate' ? this.$t('OfferCreate') : data.type == 'OfferCancel' ? this.$t('OfferCancel') : data.type == 'AccountSet' ? this.$t('AccountSet') : data.type == 'TrustSet' ? this.$t('TrustSet') : this.$t('other'),
                        count:data.amount,
                        time:dayjs(data.time).format('YYYY-MM-DD HH:mm:ss') ,
                    })
                })
                // if(res.data.total > (this.limit * this.curpage) ){
                //     this.ismore = true
                // }else{
                //     this.ismore = false
                // }
                this.ismore = res.data.marker ? true : false
                this.marker = res.data.marker
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        },
        tokenDetail(){
            this.$axios(`${api.tokenDetail}?lang=${this.$i18n.locale}`).then(
                res=>{
                    this.info = res.data
                }
            ).catch()
        },
        loadMore(){
            this.curpage++ 
            this.transactions()
        },
    }

}
</script>

<style lang="less" scoped>
@import '../assets/css/var.less';
.info{
    margin-top:20px;
    overflow: hidden;
    .desc{
        .box();
        padding:20px;
        margin:20px 0;
        text-indent:2em;
    }
    table{
    box-shadow:0 0 10px rgba(0, 0, 0, .4);
    height:100px;
    text-align: center;
    width: 100%;
    color:#fff;
    background:linear-gradient(180deg, #E15270 0%, #F6555A 100%);
    td{
        padding:0 15px;
        img{background:#fff;padding:3px;border-radius:8px}
        i{font-size:50px;}
        &:nth-child(2){            
            font-weight:bold;
            font-size:20px;
            padding:0
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
