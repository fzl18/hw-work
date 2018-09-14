<template>
  <div class="charts">
    <div class="block">
      <div class="box">
        <div class="txt ico-1">{{local[lang].chart.txt}} <span>{{height}}</span></div>
      </div>
    </div>
    <div class="chart">
      <div class="txt ico-2">{{local[lang].chart.sevenDay}}</div>
      <div id="main" style="width: 600px;height:400px;margin:30px 15px;">
        Chart Loading
      </div>
    </div>
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
      marker:[],
      getListNum:500,
      xdata: [],
      ydata: [],
      timeOffset:3,
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
          name: val == 'cn'? '日期' : 'Time',
        },
        yAxis: {
          name: val == 'cn'? '交易量' :'Transaction',
        },
      })
    }
  },
  created(){
    let today = dayjs()
    for(let s=0; s < (24 / this.timeOffset + 1);s++){
      if(s==0){
        this.xdata.unshift( 'now' )
      }else{
        this.xdata.unshift(today.add(-this.timeOffset*s,'hour').format('HH') + '点' )
      }
      this.ydata.push(0)
      this.marker.push('')
    }
  },
  mounted(){
    //拿高度
    this.getHeight()
    const Chart = echarts.init(document.getElementById('main'))
    Chart.setOption({
        title: {
            text: ''
        },
        tooltip: {},
        xAxis: [{
            name: '24小时',
            type: 'category',
            boundaryGap: false,
            axisLine:{
              show:false,
            },
            data: [dayjs().format("MM-DD")]
        }],
        yAxis: [{
          name:'交易量',
          type : 'value',
          axisLine:{show:false},
        }],
        series: [{
            name: '高度',
            type: 'line',
            // symbol: 'none',
            symbolSize:4 | 8,
            // sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#0F2F79'
                }
            },
            // areaStyle: {
            //     normal: {
            //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //             offset: 0,
            //             color: '#2D43A7'
            //         }, {
            //             offset: 1,
            //             color: '#DCE2FF'
            //         }])
            //     }
            // },
            data: [10]
        }]
    });
    
    Promise.all(
    this.xdata.map((d,i)=>
      i< 8 && Promise.resolve(this.getChartsInfo((i * this.timeOffset),(8-i)))    
    ))
    .then(()=>{
      Chart.setOption({
        xAxis: {
          data: this.xdata
        },
        series: [{
          data: this.ydata
        }]
      })
    })     
  },
  methods:{
    getChartsInfo(time,index){
      let startDay = dayjs().add((-time - this.timeOffset),'h').format('YYYY-MM-DD HH')
      let endDay = dayjs().add(-time,'h').format('YYYY-MM-DD HH')
      let st2 = dayjs(`${startDay}:00:00`).toISOString()
      let ed2 = dayjs(`${endDay}:00:00`).toISOString()
      if(time == 0){
        ed2 = dayjs().toISOString()
      }
      ajax.get(`${uri.home}?start=${st2}&end=${ed2}&descending=true&limit=${this.getListNum}&marker=${this.marker[index]}`)
      .then(data=>{
        let count = data.data.count
        this.marker[index] = data.data.marker
        this.ydata[index] += count
        if(data.data.marker){
          this.getChartsInfo(time,index)
        }
        const Chart = echarts.init(document.getElementById('main'))
        Chart.setOption({
          xAxis: {
            data: this.xdata
          },
          series: [{
            data: this.ydata
          }]
        })
      })
      .catch((data)=>{
        console.log(data)
      })
    },
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
        },20000)
      }else{
        clearTimeout()
      }         
    }
  }

}
</script>

<style scoped>
.charts{overflow: hidden;color:#373737;width:90%;margin:0 auto;margin-bottom:30px;}
.tit{font-size:18px;padding:10px}
.tit span{font-size:30px;border-radius:50%;border:1px solid #EBEBEB;background: #F9F9FB;width:50px;height:50px;display:inline-block;text-align: center;color:#2B2E8F;margin-right:10px;}
.title{background:#4639C2;color:#fff;font-size:16px;padding:10px 15px;}
.txt{padding:30px 50px;font-size:18px;position: relative;top:30px;font-weight:bold;color:#3E3E3E;}
.txt span{font-size:40px;display:block;margin-top:30px;color: #0F2F79}
.box{height:240px;}
.block{float: left;width:35%;}
.chart{float: right;width:60%;padding:0 10px;}
.ico-1, .ico-2{background:url('../assets/img/icon.png') -5px 0 no-repeat;height:30px;}
.ico-1{background-position-y:20px;}
.ico-2{background-position-y:-180px;}
</style>