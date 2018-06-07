<template>
  <div class="content">
      <Topbar type='tokenAll' />
      <table>
        <colgroup>
        <col width="80">
        </colgroup>
        <thead>
          <tr class="hd">
            <th>{{local[lang].allToken.index}}</th>
            <th>{{local[lang].allToken.logo}}</th>
            <th>{{local[lang].allToken.token}}</th>
            <th>{{local[lang].allToken.mount}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=" (list,key) in lists" :key="key">
            <td>{{key + 1}}</td>
            <td>{{list.logo}}</td>
            <td><nuxt-link to="/">{{list.token}}</nuxt-link></td>
            <td>{{list.mount}}</td>
          </tr>
        </tbody>
      </table>
  </div>  
</template>

<script>
import Topbar from '~/components/Topbar.vue'
import { mapState } from 'vuex'
export default {
  components:{Topbar},
  data(){
    return {
      lists:[{
        index:1,
        logo:'d',
        token:'3412342134',
        mount:'sdfwef'
      },{
        index:1,
        logo:'d',
        token:'3412342134',
        mount:'sdfwef'
      },{
        index:1,
        logo:'d',
        token:'3412342134',
        mount:'sdfwef'
      },{
        index:1,
        logo:'d',
        token:'3412342134',
        mount:'sdfwef'
      },{
        index:1,
        logo:'d',
        token:'3412342134',
        mount:'sdfwef'
      },]
    }
  },
  computed: {
    ...mapState([
            'local','lang'
        ])
    }
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;margin:20px 0}
  .hd th{background: #DDE5F9;height:40px;line-height:40px;padding:0 20px;color:#516190;font-size:14px;}
  tbody td{height:40px;line-height:40px;text-align:center;}
  tbody tr:nth-child(even){background: #F7F9FF}
  tbody tr:hover{background:#EEF3FF}
</style>