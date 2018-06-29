<template>
  <div class="content">
    <Spin v-if="loading">
        <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>    
    <table v-if="!loading">
      <colgroup>
      <col width="22%">
      </colgroup>
      <tbody>
        <tr >
          <td>{{local[lang].infolist.information.token}}</td>
          <td>{{data.currency}}</td>
        </tr>
        <tr >
          <td>{{local[lang].infolist.information.balance}}</td>
          <td><input type="text" :placeholder="local[lang].infolist.information.placeholder" v-model="address"><a href="#" class="btn" @click="getCurrencyBalance()">{{local[lang].infolist.information.btn}}</a> <span class="txtorange">{{key}}</span></td>
        </tr>
        <tr >
          <td>{{local[lang].infolist.information.total}}</td>
          <td>{{data.amount}}</td>
        </tr>
        <tr >
          <td>{{local[lang].infolist.information.logo}}</td>
          <td><img :src="data.logo" alt="" height="50" style="vertical-align:middle;margin:10px 0"></td>
        </tr>
        <tr >
          <td>{{local[lang].infolist.information.describe}}</td>
          <td>{{data.desc}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
import { mapState, mapMutations} from 'vuex'
import ajax from "../../common/ajax"
import {api2} from '../../common/uri'
export default {
  data(){
    return {
      data:{},
      address:'',
      key:'',
      loading:true,
    }
  },
  computed: {
    ...mapState([
      'local','lang','token'
    ])
  },
  mounted(){
    this.getSingleCurrency()
  },
  methods:{
    ...mapMutations(['changSearchKey']),
    getCurrencyBalance(){
      ajax({
        method:"post",
        url:`${api2}/currency/getCurrencyBalance`,     
        data:{
            currency:this.token,
            account:this.address
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
      })
      .then(data=>{
        console.log(data.data)
          if(data.data.code == "S00001"){
              this.key = data.data.data.result =='fail' ? '输入地址有误!' : data.data.data.value
          }
      })
      .catch((data)=>{
        console.log(data)
      })
    },
    getSingleCurrency(){
      ajax({
        method:"post",
        url:`${api2}/currency/getSingleCurrency`,     
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
          if(data.data.code == "S00001"){
            this.data = data.data.data
            this.loading = false
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
  table{width:100%;border-collapse:collapse;margin:20px 0}
  tbody td{height:50px;line-height:50px;padding-left:30px;}
  tbody tr:nth-child(even){background: #EAEEFC;color:#516190;font-size:14px;font-weight:bold}
  tbody tr:nth-child(odd) td:nth-child(odd){background: #DDE5F9;color:#516190;font-size:14px;font-weight:bold}
  tbody tr:nth-child(odd){background: #F7F9FF;}
  tbody tr:nth-child(even) td:nth-child(even){background: #fff;font-size:12px;font-weight:normal}
  input{height:36px;padding-left:10px;margin-right:10px;border:1px solid #DCDCDC;width:260px;}
  input:focus{background: #FFFFCC;}
  .btn{background:#6171EB;padding:10px 20px;color:#fff;}
  .txtorange{color:#F35822;margin-left:50px;}
</style>