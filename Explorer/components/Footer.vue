<template>
  <div class="foot">
      Copyright © 2018 EChain Foundation, Singapore <br />
        {{local[lang].footer}}
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
  .foot{font-size:14px;color:#878787;line-height:30px;padding:30px 0;text-align:center;background: #E8E8E8;}
</style>
