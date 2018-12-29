<template>
  <span class="logo">
      <router-link to="/"><img src="../assets/images/logo.png" alt=""><span class="BVC">BVC</span><span>Explorer</span></router-link>
  </span>
</template>

<script>
export default {
  name: 'Logo',
  mounted(){

  },
}
</script>

<style scoped lang="less">
    .logo{
      font-size:30px;
      font-weight: bold;
      img{vertical-align: middle;margin-right:15px;}
      span{
        height: 65px;
        line-height: 65px;
        display: inline-block;
        color:#313131;
      }      
      .BVC{
        color:#E3516D;        
      }
    }
</style>