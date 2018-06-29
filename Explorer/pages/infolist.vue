<template>
  <div class="content">
    <div class="main">
      <Topbar type="infolist" :data="token"/>
      <div class="nav">
        <nuxt-link to="distribution" active-class="cur">{{local[lang].infolist.nav.distribution}}</nuxt-link>
        <nuxt-link to="information" active-class="cur">{{local[lang].infolist.nav.information}}</nuxt-link>
        <nuxt-link to="contract" active-class="cur">{{local[lang].infolist.nav.contract}}</nuxt-link>
        <nuxt-link to="transaction" active-class="cur">{{local[lang].infolist.nav.transaction}}</nuxt-link>
      </div>
      <div class="table"><nuxt-child /></div>
    </div>
  </div>  
</template>
<script>
import ajax from "../common/ajax.js"
import Topbar from '~/components/Topbar.vue'
import {mapState} from "Vuex"
export default {
  components:{Topbar},
  data () {
    return {
      list:{},
      loading: false,
      post: null,
      error: null
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  computed: {
  ...mapState([
          'local','lang','token'
      ])
  },
  methods: {
    fetchData () {
      // ajax.get().then((data)=>{
      //   console.log(data.data)
      // })
      this.error = this.post = null
      this.loading = true
    }
  }
}
</script>
<style scoped>
  /* .main{} */
  .content{background: #fff;}
  .nav{margin-top:20px;}
  .nav a{display: inline-block;width:25%;height:50px;line-height:50px;text-align:center;background:#EBEFFF;color:#606060;font-size: 14px;font-weight:bold;position: relative;}
  .nav a:hover, .nav a.cur{color:#6171EB;background: #CCD8FF}
  .nav a.cur::after, .nav a:hover::after{content:'';width:0;height:0;border-top: 5px solid transparent;border-left: 5px solid #6171EB;border-bottom: 5px solid transparent;top:40%;left:25%;position: absolute;}
</style>
