<template>
  <div class="content">
      <Topbar type='hash' :data='hash'/>
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
            <td>{{local[lang].hash.inaddr}}</td>
            <td><a href="javascript:;" @click="gotoAccount(con.tx.Destination)">{{con.tx.Destination}}</a></td>
          </tr>
          <tr >
            <td>{{local[lang].hash.otype}}</td>
            <td>{{con.tx.TransactionType=="Payment"? lang=='cn' ? "转账" : "Payment" : lang=='cn' ? "其它" : "Other" }}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.state}}</td>
            <td>{{con.meta.TransactionResult=="tesSUCCESS" ?  lang=='cn' ? "成功" : "Success": lang=='cn' ? "失败" : "Fail" }}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.fee}}</td>
            <td>{{con.tx.Fee/1000000}}</td>
          </tr>
          <tr >
            <td>{{local[lang].hash.token}}</td>
            <td><a href="javascript:;" @click="gotoToken">{{typeof con.tx.Amount  == 'object' ? con.tx.Amount.currency : 'ECT' }}</a></td>
          </tr>
          <tr >
            <td>{{local[lang].hash.num}}</td>
            <td>{{ typeof con.tx.Amount == 'string' ? parseInt(con.tx.Amount)/1000000 : con.tx.Amount.value }}</td>
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
    hash:{
　　　handler(){
　　　　this.getList()
　　　},
　　　deep:true
    }
  },
  created(){
    this.getList()
  },
  methods:{
    ...mapMutations([
      'changSearchKey'
    ]),
    getList(){
      ajax(`/transactions/${this.hash}`)
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
        console.log(d)
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
      this.changSearchKey({type:'account',val:addr})
      this.changSearchKey({type:'searchKey',val:addr})
      this.$router.push({ path: '/account'})
    },
    gotoToken(){
      const val = typeof this.con.tx.Amount  == 'object' ? this.con.tx.Amount.currency : 'SDA'
      this.changSearchKey({type:'token',val:val.toUpperCase()})
      this.changSearchKey({type:'searchKey',val:val.toUpperCase()})
      this.$router.push({path: '/infolist/distribution'})
    },
  }
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;margin:20px 0}
  tbody td{height:40px;line-height:40px;padding-left:30px;}
  tbody tr:nth-child(even){background: #EAEEFC;color:#516190;font-size:14px;font-weight:bold}
  tbody tr:nth-child(odd) td:nth-child(odd){background: #DDE5F9;color:#516190;font-size:14px;font-weight:bold}
  tbody tr:nth-child(odd){background: #F7F9FF;}
  tbody tr:nth-child(even) td:nth-child(even){background: #fff;font-size:12px;font-weight:normal}  
</style>