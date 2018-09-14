<template>
  <div class="topbar">
      <template v-if="$route.name === 'index'">        
        <span class="tit ico-3">{{local[lang].home.tit}}</span>
      </template>
      <template v-if="$route.name === 'hash'">
          <div class="bar">{{local[lang].hash.tit}} <span>{{$route.query.v}}</span></div>
      </template>
      <template v-if="$route.name === 'account'">        
          <div class="bar">{{local[lang].account.tit}}<span>{{$route.query.v}}</span></div>
      </template>
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
    .topbar{font-size:14px;color:#fff;line-height:45px;}
    .topbar .bar{padding:30px 0;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
    .tit{color:#333;font-size:18px;font-weight:bold;padding:8px 100px 8px 30px;}
    .ico-3{background:url('../assets/img/icon.png') -5px -105px no-repeat;height:30px;padding-left:45px;}
</style>