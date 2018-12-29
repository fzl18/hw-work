<template>
  <div id="app">
    <Head />
    <div class="layout">
      <router-view v-if="isAlive"/>
    </div>
    <Foot />
    <BackTop :height="100" :bottom="100"><div class="up"><i class="iconfont icon-shang"></i> <br> TOP</div></BackTop>
  </div>
</template>
<script>
import Head from './components/Head'
import Foot from './components/Foot'
import {BackTop} from 'iview'
export default {
  name:'App',
  components:{
    Head,Foot,BackTop
  },
  provide(){
    return {
      reload: this.reload
    }
  },
  data(){
    return{
      isAlive:true
    }
  },
  methods:{
    reload(){
      this.isAlive = false
      this.$nextTick(()=>{
        this.isAlive = true
      })
    }
  }
}
</script>

<style lang="less">
  .layout{  
      min-height:calc(100vh - 170px);
  }
  .up{
    box-shadow:0 0 8px rgba(0, 0, 0,.2);
    background: #fff;
    border-radius:50%;
    height:60px;
    width: 60px;    
    color: #e4526d;
    font-size:18px;
    text-align: center;
    line-height:22px;
    padding-top:6px;
    i{
      color: #e4526d!important;
      font-size:12px!important;
      padding:0!important;
    }
  }
</style>
