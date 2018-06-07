<template>
  <div class="content">
      <table>
        <colgroup>
        <col width="80">
        <col width="60%">
        <col width="15%">
        </colgroup>
        <thead>
          <tr class="hd">
            <th>{{local[lang].infolist.distribution.index}}</th>
            <th>{{local[lang].infolist.distribution.addr}}</th>
            <th>{{local[lang].infolist.distribution.num}}</th>
            <th>{{local[lang].infolist.distribution.percent}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=" (list,key) in lists" :key="key">
            <td>{{key + 1}}</td>
            <td>{{list.logo}}</td>
            <td><nuxt-link to="/">{{list.token}}</nuxt-link></td>
            <td class="txtblue">{{list.mount}}</td>
          </tr>
        </tbody>
      </table>
  </div>  
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ajax from "../../common/ajax"
export default {
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
      'local','lang','token'
    ])
  },
  mounted(){
    this.queryList()
  },
  methods:{
    ...mapMutations(['changSearchKey']),
    queryList(){
      ajax.get('')
      .then((data)=>{
          if(data.data.result == "success"){
              data.data.payments.map((d)=> d.executed_time = dayjs(d.executed_time).format('YYYY-MM-DD HH:mm:ss'))
              this.listdata = data.data.payments
          }
      })
      .catch((data)=>{
        console.log(data)
      })
    },   
    gotoHash(val){
        this.changSearchKey({type:'token',val:val})
        this.$router.push({ path: '/hash'})
    }
  }
}
</script>

<style scoped>
  table{width:100%;border-collapse:collapse;}
  .hd th{background: #DDE5F9;height:40px;line-height:40px;padding:0 20px;color:#516190;font-size:14px;}
  tbody td{height:40px;line-height:40px;text-align:center;}
  tbody tr:nth-child(even){background: #F7F9FF}
  tbody tr:hover{background:#EEF3FF}
  
</style>