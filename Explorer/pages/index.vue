<template>
  <div class="content">
      <Charts />
      <Topbar type="home" /> 
      <div style="position: relative;">
      <Spin v-if="loading" style="padding-top:400px">
          <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>    
       <table v-if="!loading">
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
            <td><a href="javascript:;" @click="gotoToken(list.currency)">{{list.currency}}</a></td>
            <td class="txtblue">{{list.amount}}</td>
            <td class="txtblue">{{list.executed_time}}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <Back-top></Back-top>
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
      listdata: [],
      loading:true,
    }
  },
  beforeMount(){
    const hash = this.getUrlParam('hash')
    const account = this.getUrlParam('account')
    if(hash !=''){
      this.changSearchKey({type:'hash', val:hash})
      this.changSearchKey({type:'searchKey', val:hash})
      this.$router.push({ path: '/hash'})
      return false
    }
    if(account !=''){
      this.changSearchKey({type:'account', val:account})
      this.changSearchKey({type:'searchKey', val:account})
      this.$router.push({ path: '/account'})
      return false
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
          this.loading = false
          data.data.payments.map((d)=> d.executed_time = dayjs(d.executed_time).format('YYYY-MM-DD HH:mm:ss'))
          this.listdata = data.data.payments
          this.loading = false
        }
      })
      .catch(e=>{
        console.log(e)
      })
    },
    getUrlParam(paraName) {
　　　　var url = document.location.toString();
　　　　var arrObj = url.split("?");

　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;

　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");

　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　　　return "";
　　　　}
　　　　else {
　　　　　　return "";
　　　　}
　　},
    gotoHash(val){
      this.changSearchKey({type:'hash', val:val})
      this.changSearchKey({type:'searchKey', val:val})
      this.$router.push({ path: '/hash'})
    },
    gotoToken(val){
      console.log(val)
      this.changSearchKey({type:'token',val:val.toUpperCase()})
      this.changSearchKey({type:'searchKey',val:val.toUpperCase()})
      this.$router.push({path: '/infolist/distribution'})
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
