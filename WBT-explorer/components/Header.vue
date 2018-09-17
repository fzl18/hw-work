<template>
  <div class="head" :class="isHome ? 'bighead':'smallhead'">
    <div class="main">
      <div class="logo"><a  href="javascript:;" @click="gohome"></a> <div class="btn"></div></div>
      <div class="search"><input v-model="searchKey" type="text" :placeholder="local[lang].header.inputPlaceholder" @keyup.enter = "search" /><a href="javascript:;" ><i class="ivu-icon ivu-icon-search" @click="search"></i></a></div>
      <Topbar v-if="!isHome"/>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, } from 'vuex'
import Topbar from './Topbar'
export default {
  components:{
    Topbar
  },
  data(){
    return {
      isHome:false,
      head:'head',
      searchKey:'',
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route'(){
      this.fetchData()
      // this.search()
    }
  },
  computed: mapState([
    'local','lang'
  ]),
  methods: {
    ...mapMutations([
      'changLang','changSearchKey'
    ]),
    search (){
      const txt = this.searchKey.trim()
      // this.changSearchKey({type:'searchKey',val:txt})
      if(txt.length == 0){
        this.$Message.warning( this.lang == 'cn'?'搜索内容不能为空!':'Search content should not be empty.')
        return
      }
      if(txt.length == 64){
        this.$router.push({ path: `/hash?v=${txt}`})
        return
      }
      if(txt.length ==33 || txt.length ==34){
        this.changSearchKey({type:'account',val:txt})
        this.$router.push({ path: `/account?v=${txt}`})
        return
      }
      if(txt.length >=2 && txt.length <=5){
        this.changSearchKey({type:'token',val:txt.toUpperCase()})
        this.$router.push({path: '/infolist/distribution'})
        return
      }
      this.searchKey = ''
      this.$router.push({path: '/error'})
    }, 
    
    fetchData () {
      this.error = this.post = null
      this.loading = true
      this.isHome = this.$route.name === 'index' ? true : false
      this.searchKey=''
    },
    gohome(){
      this.$router.push({path: '/'})
      this.changSearchKey({type:'searchKey',val:''})
      this.searchKey = ''
    }
  }
}
</script>

<style scoped>
  a{color:#fff}
  .head{height:240px; background:url("~assets/img/top_bigbg.jpg") center top no-repeat;color:#fff;}
  .bighead{height:650px;}
  .logo{line-height:70px;height:70px;background:url("~assets/img/logo.png") 0 center no-repeat;font-size:30px;font-weight:bold}
  .logo a{color:#fff;padding-left:60px;}
  .txt{text-align:center;margin:60px auto}
  .txt h1{font-size:80px;}
  .txt p{font-size:26px;}
  .btn{float: right;}
  .btn a{font-size:12px;color:#fff;display:inline-block;padding:5px 18px;border:1px solid rgba(255,255,255,.2);border-radius:20px;line-height: 16px;background:rgba(255,255,255,.1);margin:0 5px;}
  .search{margin:15px auto;border:1px solid rgba(255,255,255,.2);border-radius:36px;width: 70%;padding:18px 0; padding-left:30px;position: relative;}
  .search input{border:none;background: none;color:#0F2F79;width:90%;font-size:16px;height:30px;line-height: 30px;text-align: center;}
  .search a{font-size:36px;color:#fff;line-height: 0px;position: absolute;top:15px;color:#98A6DF}
  input:focus{outline:none;}
  input::-webkit-input-placeholder{color:#98A6DF;font-size:16px;}input::-moz-placeholder{   /* Mozilla Firefox 19+ */color:#98A6DF;}input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */color:#98A6DF;}input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ color:#98A6DF;}
  .bighead .search{background:#fff;top:150px;color:#0F2F79;}
  .smallhead .search{width:40%;height:40px;line-height: 40px;margin:0;padding:0;float:right;background:rgba(255,255,255,.2);margin-top:30px;}
  .smallhead .search input{color:#fff;text-align:left;padding-left:20px;}
  .smallhead .search a{top:3px;color:#fff}
  .smallhead input::-webkit-input-placeholder{color:rgba(255,255,255,.7);font-size:14px;}.smallhead input::-moz-placeholder{   /* Mozilla Firefox 19+ */color:#fff;}.smallhead input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */color:#fff;}.smallhead input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ color:#fff;}

</style>
