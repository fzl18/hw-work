<template>
<div class="icoindex">
    <section class="icolist container">
        <h4>{{lang[local].ico}}</h4>
        <div class="selltip">
            <ul>
                <li>{{lang[local].icoselltip1}}</li>
                <li>{{lang[local].icoselltip2}} <a :href= "articleUrl + '/list/assetsrelease_protocol' " target="_blank"> {{lang[local].icoselltip3}}</a> {{lang[local].icoselltip8}}</li>
                <li>{{lang[local].icoselltip4}}</li>
                <li>{{lang[local].icoselltip5}}</li>
                <li>{{lang[local].icoselltip6}}</li>
                <li>{{lang[local].icoselltip7}}</li>
            </ul>
        </div>
        <dl >
            <dt>{{lang[local].going}}</dt>
            <dd v-if="list.normal_list && list.normal_list.length" @click="gotoInfo(item.coin_type,item.id)" v-for="(item,index) in list.normal_list">
                <div class="box">
                    <div class="img"><img v-if="item.logo" :src="item.logo" alt=""> <i v-if="!item.logo" class="iconfont icon-zichan_"></i> </div>
                    <p> <span class="coin">{{item.coin_type.toUpperCase()}}<em>-{{item.code_name}}</em> </span>({{lang[local].icoamount}}：{{parseFloat(item.amount)}})  <span class="lefttime"><em>{{leftDay[index]}}</em>{{lang[local].day}} <em>{{leftHour[index]}}</em>{{lang[local].hour}} <em>{{leftMut[index]}}</em>{{lang[local].minute}} <em>{{leftSec[index]}}</em>{{lang[local].second}}</span><span style="margin-top:2px;">{{lang[local].leftTime}}</span> <span style="font-size:16px;color:red;">{{item.status ==2 ? lang[local].icostop :''}}</span></p>
                </div>
            </dd>
            <dd v-if="list.normal_list && !list.normal_list.length" class="nolist">
                {{lang[local].icoempty}}
            </dd>
        </dl>
        <dl>
            <dt>{{lang[local].comesoon}}</dt>
            <dd v-if="list.not_start_list && list.not_start_list.length" @click="!moreLoading && gotoInfo(item.coin_type,item.id)" v-for="item in list.not_start_list">
                <div class="box">
                    <div class="img"><img v-if="item.logo" :src="item.logo" alt=""> <i v-if="!item.logo" class="iconfont icon-zichan_"></i> </div>
                    <p><span class="coin">{{item.coin_type.toUpperCase()}}<em>-{{item.code_name}}</em> </span> ({{lang[local].icoamount}}：{{parseFloat(item.amount)}})  <span class="lefttime" style="color:#55A528">{{ localDate(item.start_time) }} {{lang[local].comesoon}}</span> </p>
                </div>
            </dd>
            <dd v-if="list.not_start_list && list.not_start_list.length >= (5*comepage)" class="more" @click="getMore(1,comepage)">{{lang[local].viewMore}}</dd>
            <dd v-if="list.not_start_list && !list.not_start_list.length" class="nolist">
                {{lang[local].icoempty}}
            </dd>
        </dl>
        <dl>
            <dt>{{lang[local].timeover}}</dt>
            <dd v-if="list.finish_list && list.finish_list.length" @click="!moreLoading && gotoInfo(item.coin_type,item.id)" v-for="item in list.finish_list">
                <div class="box">
                    <div class="img"><img v-if="item.logo" :src="item.logo" alt=""> <i v-if="!item.logo" class="iconfont icon-zichan_"></i> </div>
                    <p><span class="coin">{{item.coin_type.toUpperCase()}}<em>-{{item.code_name}}</em> </span> ({{lang[local].icoamount}}：{{parseFloat(item.amount)}})  <span class="lefttime" style="color:#aaa;">{{lang[local].timeover}}</span></p>
                </div>
            </dd>
            <dd v-if="list.finish_list && list.finish_list.length >= (5*endpage)" class="more" @click="getMore(2,endpage)">{{lang[local].viewMore}}</dd>
            <dd v-if="list.finish_list && !list.finish_list.length" class="nolist">
                {{lang[local].icoempty}}
            </dd>
        </dl>
        <load v-if="loading" />
        <!-- <page :page="(info && info.page )|| {}" @pageChange="pageChange" v-if="info && info.list && info.page && getState == getStateSuccess && info.list.length" /> -->
    </section>
</div>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "list",
        data (){
            return {
                loading:true,
                moreLoading:false,
                list:{},
                leftDay:{},
                leftSec:{},
                leftHour:{},
                leftMut:{},
                comepage:1,
                endpage:1,
                delcur:null,
            };
        },
        created (){
            this.getList()
        },
        watch:{
            // delcur(n,o){
            //     this.list.normal_list.splice(n,1)
            //     this.list.finish_list.unshift(this.list.normal_list[n])
            //     this.getList()
            //     location.reload()
            // }
        },
        computed : {
            // ...mapState(['activeObject'])
        },
        methods : {
            gotoInfo(info,id){
                this.$router.push(`/${info}/${id}`)
            },
            getMore(type,page){

                this.moreLoading = true
                // type:1 即将开始 2 已结束
                this.axios({
                    url : this.api.getMore,
                    data : {
                        type,
                        currPage:page+1
                    }
                }).then((res) => {
                    this.moreLoading = false                    
                    if(type == 1){
                        this.list.not_start_list = this.list.not_start_list.concat(res.data.list)
                        this.comepage++
                    }else{
                        this.list.finish_list = this.list.finish_list.concat(res.data.list)
                        this.endpage++
                    }
                    
                }).catch((err) => {
                    // this.list = [];
                    this.moreLoading = false;
                });
            },
            getList(){
                this.axios({
                    url : this.api.lists,
                    data : {
                    }
                }).then((res) => {
                    this.loading = false
                    this.list = res.data
                    let timer = 0
                    setInterval(()=>{
                        const dd=[],h=[],m=[],s=[]
                            res.data.normal_list.map((d,i)=>{
                                //获取当前时间
                                let date = new Date();
                                let now = (res.data.time*1000 + (timer*1000)) || date.getTime();
                                let end = d.end_time*1000
                                //时间差
                                let leftTime2 = end-now;
                                if (leftTime2>=0) {
                                    dd.push( Math.floor(leftTime2/1000/60/60/24) )
                                    h.push( Math.floor(leftTime2/1000/60/60%24))
                                    m.push( Math.floor(leftTime2/1000/60%60))
                                    s.push( Math.floor(leftTime2/1000%60))
                                }else{
                                    dd.push(0)
                                    h.push(0)
                                    m.push(0)
                                    s.push(0)
                                }
                            })
                        this.leftDay = dd
                        this.leftHour = h
                        this.leftMut = m
                        this.leftSec = s
                        timer++
                    },1000)
                        
                    
                }).catch((err) => {
                    // this.list = [];
                    this.showStatus = false;
                });
            }
        }
    }
</script>

<style scoped lang="scss" >
    .icoindex{
        padding-top: 52px;
        background:url("../assets/images/beijing.jpg") center -25px no-repeat;
        .selltip{
            font-size:15px;
            line-height: 30px;
            margin-bottom:50px;
            li{
                margin-left:25px;
                &:first-child{
                    font-weight:bold;
                    font-size:18px;
                    margin-left:0
                }
                &:last-child{
                    color:#FF6600
                }
            }
        }
    }
    .icolist{
        margin-top:50px;
        min-height:80vh;
        padding:0 80px;
        h4{color:#FF6600; font-size:36px;margin-bottom: 80px;}
        dl{
            margin-bottom: 50px;
            overflow: hidden;
            dt{
                border-left:4px solid #FF6600;
                padding-left:10px;
                font-size:16px;
                font-weight:bold;
                margin:10px 0
            }
            dd{
                background:#F3F3F3;
                width: 100%;
                height: 108px;
                // float: left;
                margin:10px 15px 10px 0;
                padding:8px;                
                &:hover{
                    background: #FF6600;
                    p{
                        color:#fff;
                    }
                    span{
                        color:#fff!important;
                    }
                    cursor: pointer;
                }
                &.nolist{
                    height:50px;text-align:center;line-height:35px;font-size:16px;
                    &:hover{
                        background: #f3f3f3;
                        cursor: default;
                    }                
                }
                &.more{
                    text-align:center;font-size:16px;height:50px;line-height: 35px;background:none;color:#FF6600;border:1px solid #FF6600;
                    &:hover{
                        color: #fff;
                        background:#FF6600;
                    }
                }
                .img{
                    background:#fff;width: 226px;height:90px;overflow: hidden;text-align:center;float: left;
                    .iconfont{font-size:40px;color:#F3F3F3}
                    img{vertical-align: middle;width: 226px;height:90px;}
                }
                p{
                    text-align:left;margin-top: 35px;float: left;font-size:16px;margin-left:20px;
                    display: block;
                    width: calc(100% - 246px);
                    span{
                        float: right;margin-right:20px;
                        font-size:15px;
                        font-weight:normal;
                        &.lefttime{
                            color: #FF6600;
                            font-size:20px;
                            margin-top:0px;
                            em{
                                text-align: right;
                                width:25px;
                                font-style:normal;
                                display: inline-block;
                                &:first-child{
                                    width: inherit;
                                    min-width:25px;
                                }
                            }
                        }
                        &.coin{
                            float: none;
                            font-weight: bold;
                            width: 150px;
                            display: inline-block;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            position: relative;
                            top:5px;
                            em{font-style: normal;font-weight:normal}
                        }
                    }
                }
            }
        }
    }
</style>
