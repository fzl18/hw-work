<template>
  <div class="content">      
      <Spin v-if="loading">
          <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
      <table v-if="!loading">
        <colgroup>
        <col width="35%">
        <col width="8%">
        <col width="8%">
        <col width="8%">
        <col width="15%">
        </colgroup>
        <thead>
          <tr class="hd">
            <th>{{local[lang].account.hash}}</th>
            <th>{{local[lang].account.height}}</th>
            <th>{{local[lang].account.token}}</th>
            <th>{{local[lang].account.num}}</th>
            <th>{{local[lang].account.otype}}</th>
            <th>{{local[lang].account.time}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=" (list,key) in lists" :key="key">
            <td><a href="javascript:;" @click="gotoHash(list.tx_hash)">{{list.tx_hash}}</a></td>
            <td>{{list.ledger_index}}</td>
            <td><a href="javascript:;">{{list.currency}}</a></td>
            <td>{{list.amount}}</td>
            <td>
              <template v-if=" list.source != account">
                <span class="in">in</span>
              </template>
              <template v-if=" list.source == account">
                <span class="out">out</span>
              </template>
            </td>
            <td>{{list.executed_time}}</td>
          </tr>
        </tbody>
      </table>
      <div class="more" v-if="marker && marker !='done'"><i-button type="primary" size="large" @click="loadMore">{{local[lang].account.loadmore}}</i-button></div>
  </div>  
</template>

<script>
import Topbar from '~/components/Topbar.vue'
import { mapState, mapMutations } from 'vuex'
import dayjs from "dayjs"
import ajax from "../common/ajax.js"
export default {
  components:{Topbar},
  data(){
    return {
      money:0,
      currency:'CSL',
      lists:[],
      marker:'',
      remainder:[],
      loading:true,
    }
  },
  computed: {
    ...mapState([
      'local','lang','account'
    ])
  },
  watch:{
    '$routee':'getList'    
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      ajax.get(`/accounts/${this.$route.query.v}/balances`)
      .then(data=>{
        if(data.data.result = "success"){
          this.currency = data.data.balances[0].currency
          this.remainder = data.data.balances
          this.money = data.data.balances[0].value
        }
      })
      .catch((e)=>{
        console.log(e.response)
        e.response.status == 400 && this.$router.push({ path: '/error'})
        })

      ajax.get(`/accounts/${this.$route.query.v}/payments?limit=11&descending=true`)
      .then(data=>{
        if(data.data.result = "success"){          
          data.data.payments.map(d=> d.executed_time = dayjs(d.executed_time).format("YYYY-MM-DD HH:mm:ss"))
          this.lists = data.data.payments          
          this.marker = data.data.marker ? data.data.marker : 'done'
          this.loading = false
        }
      })
      .catch(e=>console.log(e))  
    },
    ...mapMutations(['changSearchKey']),
    gotoHash(val){
        this.$router.push({ path: `/hash?v=${val}`})
    },
    gotoToken(val){
      this.changSearchKey({type:'token',val:val.toUpperCase()})
      this.changSearchKey({type:'searchKey',val:val.toUpperCase()})
      this.$router.push({path: '/infolist/distribution'})
    },
    loadMore(){
      this.marker != 'done' &&
      ajax.get(`/accounts/${this.$route.query.v}/payments?limit=11&descending=true&marker=${this.marker}`)
      .then(data =>{
        if(data.data.result = "success"){
          data.data.payments.map(d=> d.executed_time = dayjs(d.executed_time).format("YYYY-MM-DD HH:mm:ss"))
          this.lists.push(...data.data.payments)
          this.marker = data.data.marker ? data.data.marker : 'done'
        }
      })
    }
  }
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;}
  .info{background:#fff;padding-left: 30px;}
  .num{color:#EA7712;margin:0 20px;}
  .unit{color:#6171EB}
  .other{float: right;}
  .hd th{height:50px;line-height:50px;padding:0 20px;color:#959595;font-size:14px;}
  tbody td{height:50px;line-height:50px;text-align:center;}
  tbody tr:nth-child(even){}
  tbody tr:hover{background:#EEF3FF}
  .in, .out{background: #4CB21F;color: #fff;padding:1px 13px;display: inline-block;text-align: center;border-radius:10px;line-height:20px;min-width:50px;}
  .out{background:#4397FF;}
  .more{text-align: center;margin:30px 0}
</style>