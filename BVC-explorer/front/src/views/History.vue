<template>
    <div class="main">
        <h1>{{$t('history.tit')}}</h1>
        <div class="historylist">
            <Table :columns="thead" :data="data" size="default" :no-data-text="$t('nodata')" :loading="loading"></Table>            
        </div>
        <div class="more" v-if="ismore">
            <Button type="primary" @click="loadMore" ghost>{{$t('more')}}</Button>
        </div>
    </div>
</template>

<script>
import {Table,Button} from 'iview'
import api from '../common/api'
import dayjs from 'dayjs'
export default {
    name:'History',
    components:{
        Table,Button
    },
    data(){
        return {
            loading:false,
            limit:15,
            curpage:1,
            ismore:false,
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
    },
    methods:{
        transactions(){
            this.loading = true
            this.$axios(`${api.transactions}?page=${this.curpage}&limit=${this.limit}`).then( res => {
                const list = res.data.transactons
                list.map(data => {
                    this.data.push({
                        hash:data.hash,
                        type: data.type == 'Payment' ? this.$t('Payment') : data.type == 'OfferCreate' ? this.$t('OfferCreate') : data.type == 'OfferCancel' ? this.$t('OfferCancel') : data.type == 'AccountSet' ? this.$t('AccountSet') : data.type == 'TrustSet' ? this.$t('TrustSet') : this.$t('other'),
                        count:data.amount,
                        time:dayjs(data.time).format('YYYY-MM-DD HH:mm:ss') ,
                    })
                })
                if(res.data.total > (this.limit * this.curpage) ){
                    this.ismore = true
                }else{
                    this.ismore = false
                }                
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        },
        loadMore(){
            this.curpage++ 
            this.transactions()
        }
    }

}
</script>

<style lang="less" scoped>
@import '../assets/css/var.less';

.historylist{
    .box();
}
.more{
    text-align: center;
    padding:30px 0;
}
</style>
