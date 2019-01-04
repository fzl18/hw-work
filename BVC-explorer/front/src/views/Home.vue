<template>
  <div class="home">
    <!-- <div class="banner">
      <div class="main">
        <Logo class="blogo"/>
        <Search class="searchbar"/>
      </div>
    </div> -->
    <div class="main">
      <div class="block">
        <div class="titlebar" style="padding-left:20px">
          <div class="h3">{{$t('home.block')}}</div><span><i class="iconfont icon-4"></i> {{nowtime}}</span>
        </div>
        <div class="card">
          <table>
            <tr>
              <td>
                <p>{{$t('home.amount')}}</p>
                <p>{{total}}</p>
              </td>
              <td><i class="iconfont icon-jiaoyi"></i></td>
            </tr>
          </table>
          <table class="no"> 
            <tr>
              <td>
                <p><span>{{$t('home.height')}}</span></p>
                <p>{{heightVal}}</p>
              </td>
              <td><i class="iconfont icon-jiaoyiliangzongpaixing"></i></td>
            </tr>
          </table>
          <table class="no">
            <tr>
              <td>
                <p><span>{{$t('home.newtrading')}}</span></p>
                <p>{{tradeVal}}</p>
              </td>
              <td><i class="iconfont icon-jiaoyijilu"></i></td>
            </tr>
          </table>
        </div>
        <div class="lineChart">
          <div class="titlebar">
            <div class="h3">{{$t('home.trading')}}</div>
            <Chart />
          </div>          
        </div>
      </div>

      <div class="blocklist">
        <div class="titlebar">
          <div class="h3">{{$t('home.blocklist')}}</div>          
        </div>
        <div class="table">
          <Table stripe :columns="thead1" :data="data1" size="small" :no-data-text="$t('nodata')" :loading="loading"></Table>
        </div>
      </div>

      <div class="tradinglist">
        <div class="titlebar">
          <div class="h3">{{$t('home.tradinglist')}}</div>
        </div>
        <div class="table">
          <Table stripe :columns="thead2" :data="data2" size="small" :no-data-text="$t('nodata')"></Table>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import Logo from '../components/Logo'
import Head from '../components/Head'
import Foot from '../components/Foot'
import Chart from '../components/Chart'
import dayjs from 'dayjs'
import Search from '../components/Search'
import api from '../common/api'
import {Table} from 'iview'
const formatday = 'YYYY-MM-DD HH:mm:ss'
export default {
  name: 'home',
  components: {
    Head,Foot,Logo,Search,Table,Chart
  },
  data(){
    return {
      loading:false,
      nowtime:null,
      total:0,
      heightVal:0,
      timer:null,
      tradeVal:0,
      thead1: [
        {
            title: this.$t('home.head1')[0],
            key: 'height',
            width:200,
            render:(h,param) => {
              return h('router-link',{
                style:'color:#e4526d',
                props:{
                  to:'/blockdetail?block=' + param.row.height
                },              
              },              
              param.row.height
              )              
            }   
        },
        {
            title: this.$t('home.head1')[1],
            key: 'hash',
            width:500,
            ellipsis:true
        },
        {
            title: this.$t('home.head1')[2],
            key: 'count',
            align:'center'
        },
        {
            title: this.$t('home.head1')[3],
            key: 'time',
            align:'right'
        }
      ],
      thead2: [
        {
            title: this.$t('home.head2')[0],
            key: 'hash',
            width:500,
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
            align:'center'                   
        },
        {
            title: this.$t('home.head2')[2],
            key: 'count',
            align:'right'
        },
        {
            title: this.$t('home.head2')[3],
            key: 'time',
            align:'right'
        }
      ],
      data1: [],
      data2: [],

    }
  },
  created(){
    this.transactionsTotal()
    this.ledgers()
    this.transactions()    
  },
  mounted(){
    this.loop(10)
  },
  beforeDestroy() {
    if(this.timer) {
      clearInterval(this.timer);
    }
  },
  methods:{
    transactionsTotal(){
      this.$axios({
        url:api.transactionsTotal
      }).then( res => {
        this.total = res.data.count > 1000000 ? (res.data.count / 1000000).toFixed(2) + 'M' : res.data.count
      }).catch(err => {
        // console.log(err)
      })
    },
    transactions(reload){
      this.$axios({
        url:api.transactions
      }).then( res => {
        if(reload){
          this.data2 = []
        }
        res.data.transactons.map(data => {
          this.data2.push({
            hash:data.hash,
            type: data.type == 'Payment' ? this.$t('Payment') : data.type == 'OfferCreate' ? this.$t('OfferCreate') : data.type == 'OfferCancel' ? this.$t('OfferCancel') : data.type == 'AccountSet' ? this.$t('AccountSet') : data.type == 'TrustSet' ? this.$t('TrustSet') : this.$t('other'),
            count:data.amount,
            time:dayjs(data.time).format(formatday) ,
          })
        })
        
      }).catch(err => {
        // console.log(err)
      })
    },
    ledgers(reload){
      this.$axios({
        url:api.ledgers,
        data:{
        }
      }).then( res => {
        if(reload){
          this.data1 = []
        }
        res.data.ledgers.map(data => {
          this.data1.push({
            height:data.ledger_index,
            hash:data.ledger_hash,
            count:data.transactions_count,
            time:dayjs(data.close_time*1000).format(formatday)
          })
        })        
        this.heightVal = res.data.ledgers[0].ledger_index
        this.tradeVal = res.data.ledgers[0].transactions_count
        this.nowtime = dayjs(res.data.ledgers[0].close_time*1000).format(formatday)
      }).catch(err => {
        // console.log(err) 
      })
    },
    loop(s){      
      this.timer = setInterval(()=>{
        if(this.$route.name == 'home'){
          this.transactions(true)
          this.ledgers(true)
        }else{
          clearInterval(this.timer)
        }
      },s*1000)    
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../assets/css/var.less');
  .banner{
    background: url('../assets/images/banner.jpg') right center no-repeat;
    height:249px;
    .main{
      text-align:center;
      .blogo{padding:40px 0;display:block;}
      .searchbar{
        width:50%;
        margin:0 auto;
      }
    }    
  }
  .block{
    margin-top:15px;
    .card{
      height:130px;
      table{
        box-shadow:0 0 6px rgba(0, 0, 0, .1);
        height:120px;
        text-align: left;
        float: left;
        width: 32%;
        color:#fff;
        
        &:nth-child(2){
          margin:0 2%;
        }
        &.no{
          background: #fff;
          color:@txtColor1;
          span{color:@txtColor2}
        }
        background:linear-gradient(180deg, #df5173 0%, #f85757 100%);
        // background:#e73c5c;
        td{
          text-align: center;
          &:first-child{
            padding-left:10%;
            text-align:left;
          }
          p{
            line-height: 20px;
            margin:0;
            &:nth-child(2){
              font-size:20px;
            }
          }
          i{
            font-size:42px;
            color:#fff;
            background:#ed556c; // #E15270; 
            padding:10px;
            border-radius:20px;
            &:first-child{
              background:#EF6475;
            }
          }
        }
      }      
    }
  }
  .lineChart{
    margin-top:20px;
    padding:20px 25px;
    .box()
  }
  .tradinglist, .blocklist{
    margin-top:20px;
    min-height: 400px;
    .titlebar{
      padding:15px 20px;
      
    }
    .box()
  }
  
</style>
