<template>
  <div class="content">
      <Charts />
      <Topbar type="home" />
       <table>
        <colgroup>
        <col width="80">
        </colgroup>
        <thead>
          <tr class="hd">
            <th>{{local[lang].home.tableHead.status}}</th>
            <th>{{local[lang].home.tableHead.hash}}</th>
            <th>{{local[lang].home.tableHead.height}}</th>
            <th>{{local[lang].home.tableHead.token}}</th>
            <th>{{local[lang].home.tableHead.num}}</th>
            <th>{{local[lang].home.tableHead.time}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=" (list,key) in listdata" :key="key">
              <td> 
                  <Icon type='checkmark-circled' class="txtgreen"></Icon>
                  <!-- <template v-if="list.status == 'OK'"><Icon type='checkmark-circled' class="txtgreen"></Icon></template> -->
                  <!-- <template v-else><Icon type='close-circled' class="txtred"></Icon></template> -->
              </td>
            <td><a href="javascript:;" @click="gotoHash(list.tx_hash)">{{list.tx_hash}}</a></td>
            <td class="txtblue">{{list.ledger_index}}</td>
            <td>{{list.currency}}</td>
            <td class="txtblue">{{list.amount}}</td>
            <td class="txtblue">{{list.executed_time}}</td>
          </tr>
        </tbody>
      </table>
  </div>  
</template>

<script>
import ajax from "../common/ajax.js"
import dayjs from "dayjs"
import Charts from '~/components/Charts.vue'
import Topbar from '~/components/Topbar.vue'
import { mapState, mapMutations } from 'vuex'
import uri from "../common/uri"
export default {
  name:'app',
  components:{Charts,Topbar},
  computed: {
        ...mapState([
            'local','lang'
        ])
    },
  data () {
    return {      
      listdata: []
    }
  },
  mounted(){
      this.queryList()
  },
  methods:{
    ...mapMutations(['changSearchKey']),
    //   fetchData () {
    //   ajax.get().then((data)=>{
    //     console.log(data.data)
    //   })
    //   this.error = this.post = null
    //   this.loading = true
    // },
    queryList(){
      ajax.get(`${uri.home}?descending=true&limit=20`)
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
      console.log(val)
        this.changSearchKey({type:'hash', val:val})
        this.$router.push({ path: '/hash'})
    }
  }
  
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;}
  .hd th{background: #DDE5F9;height:40px;line-height:40px;padding:0 20px;color:#516190;font-size:14px;}
  tbody td{height:40px;line-height:40px;text-align:center;}
  tbody tr:nth-child(even){background: #F7F9FF}
  tbody tr:hover{background:#EEF3FF}
  .txtgreen{color:#B3D465;font-size:20px}
  .txtred{color:red;font-size:20px}
</style>
