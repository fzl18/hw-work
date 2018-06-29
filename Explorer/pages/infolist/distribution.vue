<template>
  <div class="content">
    <Spin v-if="loading">
        <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>
    <table v-if="!loading">
      <colgroup>
      <col width="80">
      <col width="60%">
      <col width="15%">
      </colgroup>
      <thead>
        <tr class="hd">
          <th>{{local[lang].infolist.distribution.index}}</th>
          <th>{{local[lang].infolist.distribution.addr}}</th>
          <th>{{local[lang].infolist.distribution.num}}</th>
          <th>{{local[lang].infolist.distribution.percent}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" (list, key) in lists" :key="key">
          <td>{{key + 1}}</td>
          <td><a href="javascript:;" @click="gotoAccount(list.counterparty)">{{list.counterparty}}</a></td>
          <td class="txtblue">{{list.value}}</td>
          <td class="txtblue">{{list.percent * 100}}%</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ajax from "../../common/ajax"
import {api2} from '../../common/uri'
export default {
  data(){
    return {
      lists:[],
      page:1,
      rows:10,
      all:0,
      loading:true,
    }
  },
  computed: {
    isShowMore(){ return this.rows*this.page >= this.all ? false : true},
    ...mapState([
      'local','lang','token'
    ])
  },
  watch:{
    token:{
　　　handler(){
　　　　this.queryList()
　　　},
　　　deep:true
    }
  },
  mounted(){
    this.queryList()
  },
  methods:{
    ...mapMutations(['changSearchKey']),
    queryList(){
      ajax({
        method:"post",
        url:`${api2}/currency/getCurrencyBalancePercent`,     
        data:{
          page:this.page,
          rows:this.rows,
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
            this.lists = data.data.data.resArr
            this.loading = false
          }else{
            this.$router.push({ path: '/error'})
          }
      })
      .catch((data)=>{
        console.log(data)
      })
    },   
    gotoAccount(val){
        this.changSearchKey({type:'account',val:val})
        this.changSearchKey({type:'searchKey',val:val})
        this.$router.push({ path: '/account'})
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
  
</style>