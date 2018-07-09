<template>
  <div class="head" :class="{bighead:isHome}">
    <div class="main">
      <div class="logo"><a href="javascript:;" @click="gohome">E-chain</a> <div class="btn"><nuxt-link to = "/tokenAll">{{local[lang].header.searchToken}}</nuxt-link><a href="javascript:;" style="background:none" @click="changLang(lang =='cn' ? 'en':'cn')">{{local[lang].lang}} <Icon type="android-arrow-dropdown"></Icon></a></div></div>
      <template v-if="isHome">
        <div class="txt">
          <h1>E-chain</h1>
          <p>{{local[lang].header.topTxt}}</p>
        </div>        
      </template>
      <div class="search"><input v-model="searchKey" type="text" :placeholder="local[lang].header.inputPlaceholder" @keyup.enter = "search" /><a href="javascript:;" ><i class="ivu-icon ivu-icon-search" @click="search"></i></a></div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, } from 'vuex'
export default {
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
    '$route': 'fetchData'
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
      this.changSearchKey({type:'searchKey',val:txt})
      if(this.searchKey.trim().length == 0){
        this.$Message.warning('搜索内容不能为空')
        return
      }
      if(this.searchKey.trim().length == 64){
        this.changSearchKey({type:'hash',val:txt})
        this.$router.push({ path: '/hash'})
        return
      }
      if(this.searchKey.trim().length ==33 || this.searchKey.trim().length ==34){
        this.changSearchKey({type:'account',val:txt})
        this.$router.push({ path: '/account'})
        return
      }
      if(this.searchKey.trim().length ==2 || this.searchKey.trim().length ==3){
        this.changSearchKey({type:'token',val:txt.toUpperCase()})
        this.$router.push({path: '/infolist/distribution'})
        return
      }
      this.$router.push({path: '/error'})
    }, 
    
    fetchData () {
      this.error = this.post = null
      this.loading = true
      this.isHome = this.$route.name === 'index' ? true : false
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
  .head{height:170px; background:url("~assets/img/top_bigbg.jpg") center top no-repeat;color:#fff;}
  .bighead{height:500px;}
  .logo{line-height:70px;height:70px;background:url("~assets/img/logo.png") 0 center no-repeat;padding-left:60px;font-size:30px;font-weight:bold}
  .logo a{color:#fff;}
  .txt{text-align:center;margin:60px auto}
  .txt h1{font-size:80px;}
  .txt p{font-size:26px;}
  .btn{float: right;}
  .btn a{font-size:12px;color:#fff;display:inline-block;padding:5px 18px;border:1px solid rgba(255,255,255,.2);border-radius:20px;line-height: 16px;background:rgba(255,255,255,.1);margin:0 5px;}
  .search{margin:15px auto;border:1px solid rgba(255,255,255,.2);border-radius:30px;width: 70%;padding:10px 0; padding-left:30px;position: relative;}
  .search input{border:none;background: none;color:#fff;width:90%;font-size:14px;height:30px;line-height: 30px;}
  .search a{font-size:36px;color:#fff;line-height: 0px;position: absolute;top:6px;color:#eee}
  input:focus{outline:none;}
  input::-webkit-input-placeholder{color:#ddd;font-size:14px;}input::-moz-placeholder{   /* Mozilla Firefox 19+ */color:#ddd;}input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */color:#ddd;}input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ color:#ddd;}
</style>
