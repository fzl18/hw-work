<template>
  <div class="content">
      <table>
        <colgroup>
        <col width="35%">
        <col width="7%">
        <col width="7%">
        <col width="7%">
        <col width="15%">
        <col width="10%">
        </colgroup>
        <thead>
          <tr class="hd">
            <th>{{local[lang].infolist.transaction.hash}}</th>
            <th>{{local[lang].infolist.transaction.height}}</th>
            <th>{{local[lang].infolist.transaction.token}}</th>
            <th>{{local[lang].infolist.transaction.num}}</th>
            <th>{{local[lang].infolist.transaction.from}}</th>
            <th>{{local[lang].infolist.transaction.to}}</th>
            <th>{{local[lang].infolist.transaction.time}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=" (list,key) in lists" :key="key">
            <td>{{key + 1}}</td>
            <td>{{list.logo}}</td>
            <td><nuxt-link to="/">{{list.token}}</nuxt-link></td>
            <td class="txtblue">{{list.mount}}</td>
            <td>
              <template v-if=" list.mount == 'in'">
                <span class="in">{{lang == 'cn' ? '转入' : 'in'}}</span>
              </template>
              <template v-if=" list.mount == 'out'">
                <span class="out">{{lang == 'cn' ? '转出' : 'out'}}</span>
              </template>
            </td>
            <td class="txtblue">{{list.mount}}</td>
          </tr>
        </tbody>
      </table>
  </div>  
</template>

<script>
import Topbar from '~/components/Topbar.vue'
import { mapState, mapMutations} from 'vuex'
import ajax from "../../common/ajax"
import {api2} from '../../common/uri'
export default {
  components:{Topbar},
  data(){
    return {
      lists:[]
    }
  },
  computed: {
    ...mapState([
      'local','lang','token'
    ])
  },
  mounted(){
    this.queryList()
  },
  methods:{
    ...mapMutations(['changSearchKey']),
    queryList(){
      ajax({
        method:"post",
        url:`${api2}/currency/getTokenPayments`,     
        data:{
            currency:this.token,
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
      })
      .then((data)=>{
          if(data.data.result == "success"){
              data.data.payments.map((d)=> d.executed_time = dayjs(d.executed_time).format('YYYY-MM-DD HH:mm:ss'))
              this.listdata = data.data.payments
          }
      })
      .catch((data)=>{
        console.log(data)
      })
    },   
    gotoHash(val){
        this.changSearchKey({type:'hash',val:val})
        this.$router.push({ path: '/hash'})
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
</style>