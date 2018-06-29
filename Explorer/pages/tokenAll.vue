<template>
  <div class="content">
      <Topbar type='tokenAll' />
      <Spin v-if="loading">
          <Icon type="load-c" size=30 class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
      <table v-if="!loading">
        <colgroup>
        <col width="80">
        </colgroup>
        <thead>
          <tr class="hd">
            <th>{{local[lang].allToken.index}}</th>
            <th>{{local[lang].allToken.logo}}</th>
            <th>{{local[lang].allToken.token}}</th>
            <th>{{local[lang].allToken.mount}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=" (list,key) in lists" :key="key">
            <td>{{key + 1}}</td>
            <td> <img :src="list.pic" alt="" width="50"/></td>
            <td><a href="javascript:;" @click="gotoToken(list.currency)">{{list.currency}}</a></td>
            <td>{{list.limit}}</td>
          </tr>
        </tbody>
      </table>
       <div class="more" v-if="isShowMore"><i-button type="primary" size="large" @click="loadMore">{{local[lang].account.loadmore}}</i-button></div>
  </div>  
</template>

<script>
import ajax from "../common/ajax.js"
import Topbar from '~/components/Topbar.vue'
import { mapState, mapMutations} from 'vuex'
import {api2} from '../common/uri'
export default {
  components:{Topbar},
  data(){
    return {
      lists:[],
      page:1,
      rows:10,
      all:0,
      loading:true
      
    }
  },
  computed: {
    isShowMore(){ return this.rows*this.page >= this.all ? false : true}  ,
    ...mapState([
            'local','lang'
        ]),    
    },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      ajax({
        method:"post",
        url:`${api2}/currency/getCurrencyPaLists`,        
        data:{
            page:this.page,
            rows:this.rows
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
      })
      .then((res)=>{
        if(res.data.code == "S00001"){
          this.lists = res.data.data.currencyList
          this.loading = false
          this.all = res.data.data.all
        }else{
          console.log(res.data)
        }          
      })
      .catch(e=>console.log(e))
    },
    ...mapMutations(['changSearchKey']),
    gotoToken(val){
      this.changSearchKey({type:'token',val:val.toUpperCase()})
      this.changSearchKey({type:'searchKey',val:val.toUpperCase()})
      this.$router.push({path: '/infolist/distribution'})
    },
    loadMore(){
      ++ this.page
      ajax({
        method:"post",
        url:`${api2}/currency/getCurrencyPaLists`,        
        data:{
            page:this.page,
            rows:this.rows
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
      })
      .then(res =>{
        if(res.data.code == "S00001"){
          this.lists.push(...res.data.data.currencyList)
        }
      })
    }
  }
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;margin:20px 0}
  .hd th{background: #DDE5F9;height:40px;line-height:40px;padding:0 20px;color:#516190;font-size:14px;}
  tbody td{height:40px;line-height:40px;text-align:center;}
  tbody td img{vertical-align:middle;max-height:30px;max-width:30px;}
  tbody tr:nth-child(even){background: #F7F9FF}
  tbody tr:hover{background:#EEF3FF}
  .more{text-align: center;margin:30px 0}
</style>