<template>
  <div class="content">
      <Topbar type='account' :data="account">
        <div class="info">
          {{local[lang].account.assets}} : <span class="num">{{money}}</span>    <span class="unit">{{currency}}</span>      <span class="other">{{local[lang].account.remainder}}：</span> 
        </div>
      </Topbar>
      <table>
        <colgroup>
        <col width="35%">
        <col width="10%">
        <col width="15%">
        <col width="15%">
        <col width="10%">
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
            <td>{{list.currency}}</td>
            <td>{{list.amount}}</td>
            <td>
              <template v-if=" list.source != account">
                <span class="in">{{lang == 'cn' ? '转入' : 'in'}}</span>
              </template>
              <template v-if=" list.source == account">
                <span class="out">{{lang == 'cn' ? '转出' : 'out'}}</span>
              </template>
            </td>
            <td>{{list.executed_time}}</td>
          </tr>
        </tbody>
      </table>
      <div class="more"><i-button type="primary" size="large" @click="loadMore">加载更多</i-button></div>
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
      currency:'SDA',
      lists:[],
      marker:'',
    }
  },
  computed: {
    ...mapState([
      'local','lang','account'
    ])
  },
  mounted(){
    ajax.get(`/accounts/${this.account}/balances`)
    .then(data=>{
      if(data.data.result = "success"){
        this.currency = data.data.balances[0].currency
        this.money = data.data.balances[0].value
      }
    })
    .catch(d=>console.log(d))

    ajax.get(`/accounts/${this.account}/payments?limit=11&descending=true`)
    .then(data=>{
      if(data.data.result = "success"){
        data.data.payments.map(d=> d.executed_time = dayjs(d.executed_time).format("YYYY-MM-DD HH:mm:ss"))
        this.lists = data.data.payments        
        this.marker = data.data.marker && data.data.marker
      }
    })
    .catch(d=>console.log(d))    
  },
  methods:{
    ...mapMutations(['changSearchKey']),
    gotoHash(val){
        this.changSearchKey({type:'hash',val:val})
        this.$router.push({ path: '/hash'})
    },
    loadMore(){
      this.marker &&
      ajax.get(`/accounts/${this.account}/payments?limit=11&descending=true&marker=${this.marker}`)
      .then(data =>{
        if(data.data.result = "success"){
          data.data.payments.map(d=> d.executed_time = dayjs(d.executed_time).format("YYYY-MM-DD HH:mm:ss"))
          this.lists.push(...data.data.payments)
          this.marker = data.data.marker ? data.data.marker : ''
        }
      })
    }
  }
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;}
  .info{background:#fff;}
  .num{color:#EA7712;margin:0 20px;}
  .unit{color:#6171EB}
  .other{float: right;}
  .hd th{background: #DDE5F9;height:40px;line-height:40px;padding:0 20px;color:#516190;font-size:14px;}
  tbody td{height:40px;line-height:40px;text-align:center;}
  tbody tr:nth-child(even){background: #F7F9FF}
  tbody tr:hover{background:#EEF3FF}
  .in, .out{background: #4CB21F;color: #fff;padding:1px 13px;display: inline-block;text-align: center;border-radius:10px;line-height:20px;min-width:50px;}
  .out{background:#4397FF;}
  .more{text-align: center;margin:30px 0}
</style>