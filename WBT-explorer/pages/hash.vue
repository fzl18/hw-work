<template>
  <div class="content">
      <Spin v-if="loading">
          <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
      <table v-if='Object.keys(con).length > 0'>
        <colgroup>
        <col width="22%">
        </colgroup>
        <tbody>
          <tr >
            <td>{{local[lang].hash.hash}}</td>
            <td>{{con.hash}}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.heigth}}</td>
            <td>{{con.ledger_index}}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.outaddr}}</td>
            <td><a href="javascript:;" @click="gotoAccount(con.tx.Account)">{{con.tx.Account}}</a></td>
          </tr>
          <tr >
            <td>{{con.tx.TransactionType=="OfferCreate" ?'支付金额' :local[lang].hash.inaddr}}</td>
            <td v-if="con.tx.TransactionType !='OfferCreate'"><a href="javascript:;" @click="gotoAccount(con.tx.Destination)">{{con.tx.Destination}}</a></td>
            <td v-if="con.tx.TransactionType =='OfferCreate'">{{con.tx.TakerGets && con.tx.TakerGets / 100000 + ' CSL'}} <span v-if="con.tx.TakerGets.issuer">( 发行地址：<a href="javascript:;" @click="gotoAccount(con.tx.TakerGets.issuer)">{{con.tx.TakerGets.issuer}}</a> )</span></td>
          </tr>
          <tr >
            <td>{{local[lang].hash.otype}}</td>
            <td>{{con.tx.TransactionType=="Payment"?  "转账"  : con.tx.TransactionType=="OfferCreate" ?  "兑换" : "其它" }}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.state}}</td>
            <td>{{con.meta.TransactionResult=="tesSUCCESS" ?  lang=='cn' ? "成功" : "Success": lang=='cn' ? "失败" : "Fail" }}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.fee}}</td>
            <td>{{con.tx.Fee/1000000}} CSL</td>
          </tr>
          <tr v-if="con.tx.TransactionType !='OfferCreate'">
            <td>{{local[lang].hash.token}}</td>
            <td><a href="javascript:;">{{typeof con.tx.Amount  == 'object' ? con.tx.Amount.currency : 'CSL' }}</a></td>
          </tr>
          <tr >
            <td>{{con.tx.TransactionType=="OfferCreate"? '预收入':local[lang].hash.num}}</td>
            <td v-if="con.tx.TransactionType !='OfferCreate'">{{ typeof con.tx.Amount == 'string' ? parseInt(con.tx.Amount)/1000000 : con.tx.Amount ? con.tx.Amount.value :'' }}</td>
            <td v-if="con.tx.TransactionType =='OfferCreate'">{{ con.tx.TakerPays.value }} {{parseCurrency(con.tx.TakerPays.currency)}} <span v-if="con.tx.TakerPays.issuer"> ( 发行地址：<a href="javascript:;" @click="gotoAccount(con.tx.TakerPays.issuer)">{{con.tx.TakerPays.issuer}}</a> )</span></td>
          </tr>
          <tr >
            <td>{{local[lang].hash.time}}</td>
            <td>{{con.date}}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.note}}</td>
            <td>{{remake}}</td>
          </tr>
        </tbody>
      </table>
  </div>  
</template>

<script>
import ajax from '../common/ajax'
import dayjs from 'dayjs'
import Topbar from '~/components/Topbar.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  components:{Topbar},
  data(){
    return {
      con:{},
      loading:true,      
    }
  },
  computed: {
    ...mapState([
          'local','lang','hash'
        ]),    
    remake(){
      if(this.con.tx.Memos){
        return decodeURI(this.prePro(this.con.tx.Memos[0].Memo.MemoData))
      }      
    }
  },
  watch:{
    '$route': 'getList'    
  },
  created(){
    this.getList()
  },
  mounted(){
  },
  methods:{
    ...mapMutations([
      'changSearchKey'
    ]),
    getList(){
      ajax(`/transactions/${this.$route.query.v}`)
      .then(data => {
        if(data.data.result=="success"){
          this.loading = false
          data.data.transaction.date = dayjs(data.data.transaction.date).format("YYYY-MM-DD HH:mm:ss")
          this.$nextTick(function () {
            this.con = data.data.transaction
          })          
        }
      })
      .catch( d=> {
        this.$router.push({path: '/error'})
      })
    },
    prePro(data){
      if (data.length % 2) return '';
      let tmp='';
      for(let i=0;i<data.length;i+=2){
        tmp += '%' + data.charAt(i) + data.charAt(i+1);
      }
      return tmp;
    },
    gotoAccount(addr){
      this.$router.push({ path: `/account?v=${addr}`})
    },
    gotoToken(){
      const val = typeof this.con.tx.Amount  == 'object' ? this.con.tx.Amount.currency : 'CSL'
      this.changSearchKey({type:'token',val:val.toUpperCase()})
      this.changSearchKey({type:'searchKey',val:val.toUpperCase()})
      this.$router.push({path: '/infolist/distribution'})
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
  table{width:100%;border-collapse:collapse;margin:20px 0}
  tbody td{height:50px;line-height:50px;padding-left:80px;}
  tbody tr:nth-child(even){color:#959595;font-size:14px;font-weight:bold;}
  tbody tr:nth-child(odd) td:nth-child(odd){color:#959595;font-size:14px;font-weight:bold;}
  tbody tr:nth-child(odd){}
  tbody tr:nth-child(even) td:nth-child(even){font-size:12px;font-weight:normal}  
</style>