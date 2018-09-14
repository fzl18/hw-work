<template>
  <div class="foot">
      CopyRight © 2015~2018 江苏恒为信息科技有限公司 | 苏ICP备16008019号-1 <br />
        <!-- {{local[lang].footer}} -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: mapState([
    'local','lang'
  ]),
}
</script>

<style scoped>
  .foot{font-size:14px;color:#fff;line-height:30px;padding:20px 0;text-align:center;background: #0D2147;}
</style>
