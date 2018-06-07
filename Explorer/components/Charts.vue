<template>
  <div class="charts">
    <div class="block">
      <div class="tit"> <span><Icon type="ios-pulse"></Icon></span> {{local[lang].chart.name}}</div>
      <div class="box">
        <div class="title">{{local[lang].chart.tit}}</div>
        <div class="txt">{{local[lang].chart.txt}} <span>{{height}}</span></div>
      </div>
    </div>
    <div class="chart" id="main" style="width: 600px;height:400px;">Chart Loading</div>
  </div>
</template>
<script>
import dayjs from "dayjs"
import echarts from "echarts/lib/echarts"
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import ajax from "../common/ajax.js"
import {mapState} from "Vuex"
import uri from "../common/uri"
const dayFormat = "YYYY-MM-DD"
export default {
  data(){
    return {
      data:{},
      height:'',
    }
  },
  computed: {
    ...mapState([
      'local','lang'
    ]),    
  },
  watch:{
    lang(val){
      const Chart = echarts.init(document.getElementById('main'))
      Chart.setOption({
        xAxis: {
          name: val == 'cn'? '时间' : 'Time',
        },
        yAxis: {
          name: val == 'cn'? '交易量' :'Transaction',
        },
      })
    }
  },
  created(){
    //拿高度
    this.getHeight()
  },
  mounted(){
    const Chart = echarts.init(document.getElementById('main'))
    Chart.setOption({
        title: {
            text: ''
        },
        tooltip: {},
        xAxis: {
            name: '时间',
            type: 'category',
            boundaryGap: false,
            data: [dayjs().format("MM-DD")]
        },
        yAxis: {
          name:'交易量',
        },
        series: [{
            name: '高度',
            type: 'line',
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#2D43A7'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2D43A7'
                    }, {
                        offset: 1,
                        color: '#DCE2FF'
                    }])
                }
            },
            data: [10]
        }]
    });
    //拿图表
    ajax.get(`${uri.home}?start=${dayjs().add(-5,'d').format(dayFormat)}T16:00:00Z&end=${dayjs().add(0,'d').format(dayFormat)}T16:00:00Z&descending=true&limit=1000000`)
      .then((data)=>{
        const xdata = [], ydata = []
        for(var i = 5;i>=0;i--){
          xdata.push(dayjs().add(-i,'d').format("MM-DD"))
          ydata.push(0)
        }
        var payments = data.data.payments;
        var j=0;
        for(var i=0;i<payments.length;i++){
            var date = dayjs(payments[i].executed_time).format("MM-DD")
            if(date == dayjs().add(-j,'d').format("MM-DD")){
                ydata[5-j]++
              }else{
                i--
                j++
              }
        }
        Chart.setOption({
          xAxis: {
            data: xdata
          },
          series: [{
            data:ydata
          }]
        })
      })
      .catch((data)=>{
        console.log(data)
      })

  },
  methods:{    
    getHeight(){
      ajax('/ledgers')
      .then(data=>{
        if(data.data.result=="success"){
          this.height = data.data.ledger.ledger_index
        }      
      })
      .catch(e=>console.log(e))
      if(this.$route.name == 'index'){
        setTimeout(()=>{
          this.getHeight()
        },5000)
      }else{
        clearTimeout()
      }      
    }
  }

}
</script>

<style scoped>
.charts{overflow: hidden;color:#373737;width:80%;margin:0 auto;margin-bottom:30px;}
.tit{font-size:18px;padding:10px}
.tit span{font-size:30px;border-radius:50%;border:1px solid #EBEBEB;background: #F9F9FB;width:50px;height:50px;display:inline-block;text-align: center;color:#2B2E8F;margin-right:10px;}
.title{background:#4639C2;color:#fff;font-size:16px;padding:10px 15px;}
.txt{padding:30px;font-size:16px;position: relative;top:30px}
.txt span{font-size:42px;font-weight:bold}
.box{background: #F6F7FA;height:240px;}
.block{float: left;width:30%;padding:0 30px}
.chart{float: left;width:70%;padding:0 30px}
</style>