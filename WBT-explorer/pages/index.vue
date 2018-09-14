<template>
<div class="indexbox">
  <div class="content">
      <Charts />      
  </div> 
  <div class="content" style="top:50px;">
    <Topbar type="home" /> 
      <div style="position: relative;" v-if="loading">
        <Spin style="padding-top:400px">
            <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>       
      </div>
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
                  <!-- <Icon type='checkmark-circled' class="txtgreen"></Icon> -->
                  <template v-if="list.meta.TransactionResult == 'tesSUCCESS'"><Icon type='checkmark-circled' class="txtgreen"></Icon></template>
                  <template v-else><Icon type='close-circled' class="txtred" :title="list.meta.TransactionResult"></Icon></template>
              </td>
            <td><a href="javascript:;" @click="gotoHash(list.hash)">{{list.hash}}</a></td>
            <td>{{list.ledger_index}}</td>
            <td>{{type(list.tx.TransactionType)}}</td>
            <td>{{parseValue(list.tx)}}</td>
            <td>{{list.date}}</td>
          </tr>
        </tbody>
      </table>
  </div>
      <Back-top/>
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
  // beforeMount(){
  //   if(hash !=''){
  //     this.$router.push({ path: '/hash'})
  //     return false
  //   }
  //   if(account !=''){
  //     this.$router.push({ path: '/account'})
  //     return false
  //   }
  // },
  created(){    
    this.queryList()
  },
  methods:{
    // ...mapMutations(['changSearchKey']),
    queryList(){
      ajax.get(`${uri.home}?descending=true&limit=20`)
      .then((data)=>{
        this.loading = false
        if(data.data.result == "success"){
          data.data.transactions.map(d=> d.date = dayjs(d.date).format('YYYY-MM-DD HH:mm:ss'))
          this.listdata = data.data.transactions
        }
      })
      .catch(e=>{
        console.log(e)
        this.loading = false
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
      this.$router.push({ path: `/hash?v=${val}`})
    },
    gotoToken(val){
      console.log(val)
      this.changSearchKey({type:'token',val:val.toUpperCase()})
      this.changSearchKey({type:'searchKey',val:val.toUpperCase()})
      this.$router.push({path: '/infolist/distribution'})
    },

    type(type) {
      let ctype
      switch (type) {
        case 'Payment':
            ctype = '转账'
          break;
        case 'OfferCreate':
            ctype = '兑换'
          break;
        case 'OfferCancel':
            ctype = '取消挂单'
          break;
        case 'AccountSet':
            ctype = '帐户设置'
          break;
        case 'TrustSet':
            ctype = '信任栈设置'
          break;
        default:
            ctype = '其他'
          break;
      }
      return ctype
    },
    


parseValue(tx) {
      var value = '-'
      switch (tx.TransactionType) {
        case 'Payment':
          value = typeof tx.Amount == 'object' ? tx.Amount.value + ' ' + this.parseCurrency(tx.Amount.currency) : tx.Amount / 1000000 + ' ' + 'CSL'
          break
        case 'OfferCreate':
          var takerPays = typeof tx.TakerPays == 'object' ? tx.TakerPays.value + ' ' + this.parseCurrency(tx.TakerPays.currency) : tx.TakerPays / 1000000 + ' ' + 'CSL'
          var takerGets = typeof tx.TakerGets == 'object' ? tx.TakerGets.value + ' ' + this.parseCurrency(tx.TakerGets.currency) : tx.TakerGets / 1000000 + ' ' + 'CSL'
          value = takerPays + ' => ' + takerGets
          break
        case 'TrustSet':
          value = typeof tx.LimitAmount == 'object' ? tx.LimitAmount.value + ' ' + this.parseCurrency(tx.LimitAmount.currency) : tx.LimitAmount / 1000000 + ' ' + 'CSL'
          break
      }
      return value
    },


  hexCharCodeToStr (hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim()
    var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ?
      trimedStr.substr(2)
      :
      trimedStr
    var len = rawStr.length
    if (len % 2 !== 0) {
      alert('Illegal Format ASCII Code!')
      return ''
    }
    var curCharCode
    var resultStr = []
    for (var i = 0; i < len;i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16)
      resultStr.push(String.fromCharCode(curCharCode))
    }
    return resultStr.join('')
  },

  
   parseCurrency(currency) {
      if (currency.length == 40) {
        return this.hexCharCodeToStr(currency.replace(/0/g, ''))
      }else {
        return currency
      }
    }






  }
  
}
</script>

<style scoped>
  .indexbox{overflow:hidden;margin-bottom:50px;padding-bottom:100px;}
  .indexbox .content:nth-child(2){padding:30px 50px;}
  .indexbox .content:nth-child(1){padding-bottom:20px;min-height:20vh;}
  table{width:100%;border-collapse:collapse;}
  .hd th{background: #FBFBFB;height:40px;line-height:40px;padding:0 20px;color:#959595;font-size:14px;}
  tbody td{height:40px;line-height:40px;text-align:center;}
  tbody tr:nth-child(even){background: #FBFBFB}
  tbody tr:hover{background:#eee}
  .txtgreen{color:#28BC91;font-size:20px}
  .txtred{color:red;font-size:20px}
</style>
