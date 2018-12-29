<template>
    <div class="main">
        <h1>{{$t('block.tit')}}</h1>
        <div class="blocklist">
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
    name:'Block',
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
                    title: this.$t('block.head')[0],
                    key: 'height',
                    width:140,
                    render:(h,param) => {
                    return h('router-link',{
                        style:'color:#e4526d',
                        props:{
                        to:'/blockdetail?block=' + param.row.height
                        },
                    },
                    param.row.height
                    )} 
                },
                {
                    title: this.$t('block.head')[1],
                    key: 'hash',
                    align:'center'                   
                },
                {
                    title: this.$t('block.head')[2],
                    key: 'count',
                    align:'center',
                    width:250
                },
                {
                    title: this.$t('block.head')[3],
                    key: 'time',
                    align:'right',
                    width:200
                }
            ],
            data:[],
        }
    },
    created(){
        this.ledgers()
    },
    methods:{
        ledgers(){
            this.loading = true
            this.$axios(`${api.ledgers}?page=${this.curpage}&limit=${this.limit}`).then( res => {
                const list = res.data.ledgers
                list.map(data => {
                    this.data.push({
                        height:data.ledger_index,
                        hash:data.ledger_hash,
                        count:data.transactions_count,
                        time:dayjs(data.close_time*1000).format('YYYY-MM-DD HH:mm:ss') ,
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
            this.ledgers()
        }
    }
}
</script>
<style lang="less" scoped>
@import '../assets/css/var.less';

.blocklist{
    .box();  
}
.more{
    text-align: center;
    padding:30px 0;
}
</style>
