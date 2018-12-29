<template>
  <div class="foot">
    <div class="main">
      <Logo class="flogo"/><span class="txt"> {{$t('copyright')}}</span>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
export default {
  name: 'Foot',
  components:{
    Logo,
  },
  mounted(){

  },
}
</script>

<style scoped lang="less">
  .foot{
    text-align:center;
    padding:10px 0;
    background:#F1F1F1;
    .flogo{
      display: inline-block;
      transform:scale(.4,.4);
    }
    .txt{
      font-size:12px;
      position: relative;
      right: 70px;
      bottom: 6px;
    }
  }
  

</style>