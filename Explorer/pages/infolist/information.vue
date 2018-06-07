<template>
  <div class="content">
      <table>
        <colgroup>
        <col width="22%">
        </colgroup>
        <tbody>
          <tr >
            <td>{{local[lang].infolist.information.token}}</td>
            <td>dfd</td>
          </tr>
          <tr >
            <td>{{local[lang].infolist.information.balance}}</td>
            <td><input type="text" :placeholder="local[lang].infolist.information.placeholder" v-model="key"><a href="#" class="btn" @click="search(key)">{{local[lang].infolist.information.btn}}</a> <span class="txtorange">{{key}}</span></td>
          </tr>
          <tr >
            <td>{{local[lang].infolist.information.total}}</td>
            <td>wefd</td>
          </tr>
          <tr >
            <td>{{local[lang].infolist.information.logo}}</td>
            <td>wefd</td>
          </tr>
          <tr >
            <td>{{local[lang].infolist.information.describe}}</td>
            <td>wefdf</td>
          </tr>
        </tbody>
      </table>
  </div>  
</template>

<script>
import { mapState } from 'vuex'
export default {
  data(){
    return {
      data:[],
      key:''

    }
  },
  computed: {
    ...mapState([
            'local','lang','token'
    ])
  },
  methods:{
    search(key){
      console.log(key)
    }
  }
}
</script>
<style scoped>
  table{width:100%;border-collapse:collapse;margin:20px 0}
  tbody td{height:50px;line-height:50px;padding-left:30px;}
  tbody tr:nth-child(even){background: #EAEEFC;color:#516190;font-size:14px;font-weight:bold}
  tbody tr:nth-child(odd) td:nth-child(odd){background: #DDE5F9;color:#516190;font-size:14px;font-weight:bold}
  tbody tr:nth-child(odd){background: #F7F9FF;}
  tbody tr:nth-child(even) td:nth-child(even){background: #fff;font-size:12px;font-weight:normal}
  input{height:36px;padding-left:10px;margin-right:10px;border:1px solid #DCDCDC;width:260px;}
  input:focus{background: #FFFFCC;}
  .btn{background:#6171EB;padding:10px 20px;color:#fff;}
  .txtorange{color:#F35822;margin-left:50px;}
</style>