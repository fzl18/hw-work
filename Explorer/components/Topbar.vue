<template>
  <div class="topbar">
      <template v-if="type === 'home'">        
        <span class="tit">{{local[lang].home.tit}}</span>
      </template>
      <template v-if="type === 'infolist'">        
          <div>{{local[lang].infolist.tit}}<span style="color:#6171EB">{{data}}</span></div> 
      </template>
      <template v-if="type === 'tokenAll'">
          <div>{{local[lang].allToken.tit}}</div>
      </template>
      <template v-if="type === 'hash'">
          <div>{{local[lang].hash.tit}} {{data}}</div>
      </template>
      <template v-if="type === 'account'">        
          <div>{{local[lang].account.tit}}{{data}}</div>
          <slot></slot>
      </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props:['type','data'],
    computed: mapState([
        'local','lang'
    ]),
}
</script>

<style scoped>
    .topbar{border-top:6px solid #1C1F87;background: #F1F5FF;font-size:14px;color:#737373;line-height:45px;font-weight: bold;}
    .topbar div{padding:0 30px;}
    .tit{background: #4539C3;color:#fff;font-size:18px;font-weight:bold;padding:8px 100px 8px 30px;border-radius:0 20px 20px 0}
</style>