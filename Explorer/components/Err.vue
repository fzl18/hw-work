<template>
  <div class="err">
    <template v-if="type === 404">        
        <img src="~assets/img/404.jpg" alt="">
        <p>{{local[lang].error.e404}}</p>
    </template>
    <template v-if="type === 500">
        <img src="~assets/img/500.jpg" alt="">
        <p>{{local[lang].error.e500}}</p>
    </template>
    <template v-if="type === 'token'">
        <img src="~assets/img/err.jpg" alt="">
        <p>{{local[lang].error.etxt}}</p>
        <div class="string">{{searchKey}}</div>
    </template>
  </div>
</template>
<script>
import {mapState} from "Vuex"
export default {
    props:['type'],
    computed: mapState([
        'local','lang','searchKey'
    ]),
}
</script>

<style scoped>
  .err{text-align:center;padding-top:13%}
  p, .string{font-size:30px;color:#515997;font-weight:bold;}
</style>