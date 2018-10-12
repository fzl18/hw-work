<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].c2cOrder}}</span>
        </financeHeader>
        <section class="c2cindex">
        <div class="coin">
            <div class="search" @click.stop="showSearch" style="width:40%">
                <div class="box">
                    <template v-for="(item,index) in searchList">
                        <span v-if="item">{{item=='buy'?'购买':item=='sell'?'售出':item=='1'?'待付款':item=='2'?'已关闭':item=='3'?'已付款':item=='4'?'已完成':item=='5'?'申诉中':item=='sell'?'':item}} <Icon type="close" size="12" class="close" @click="delSearchTxt(index)"/></span>
                    </template>
                </div>
                <Poptip trigger="hover" placement="bottom-end" ref="searchBox" :width=460>
                    <Icon type="ios-search" size="26" class="btn"/>
                    <div class="api" slot="content">
                        <table class="select" >
                            <tbody>
                                    <tr>
                                        <td align="right">日期：</td>
                                        <td>
                                            <DatePicker v-model="searchTxt.date" size="large" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 300px"></DatePicker>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right">订单状态：</td>
                                        <td>
                                            <Select v-model="searchTxt.status" size="large" style="width:300px">
                                                <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right">订单编号：</td>
                                        <td>
                                            <Input v-model="searchTxt.id" size="large" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right">交易类型：</td>
                                        <td>
                                            <Select v-model="searchTxt.transferType" size="large" style="width:300px">
                                                <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right">币种：</td>
                                        <td>
                                            <Select v-model="searchTxt.coin" size="large" style="width:300px">
                                                <Option v-for="item in coinList" :value="item.toUpperCase()" :key="item">{{ item.toUpperCase() }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right">法币币种：</td>
                                        <td>
                                            <Select v-model="searchTxt.fCoin" size="large" style="width:300px">
                                                <Option v-for="item in currencyList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                <tr>
                                    <td align="center" style="padding:50px 0 20px 0">
                                        <Button size="large" type="text" class="org" @click="allClear">清空筛选</Button>
                                    </td>
                                    <td align="right"  style="padding:50px 0 20px 0">
                                        <Button size="large" type="primary" @click.stop="handleSearch">搜索</Button> <Button size="large" type="text" @click.stop="closeSearch">取消</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Poptip>
            </div>
        </div>
        <div class="list">
            <dl>
                <dt>
                    <ul>
                        <li>订单编号</li>
                        <li>类型</li>
                        <li>数量</li>
                        <li>总价</li>
                        <li>单价</li>
                        <li>手续费</li>
                        <li>状态</li>
                        <li>操作</li>
                    </ul>

                </dt>
                <dd v-for="item in orderListArrary">
                    <ul>
                        <li :title="item.orderid">{{item.orderid}}</li>
                        <li :class="item.type == 1 ? 'tbuy' : 'tsell'">{{item.type == 1 ? '购买' : '售出'}}</li>
                        <li>{{item.amount}} {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.money}} CNY</li>
                        <li>{{item.price}} CNY</li>
                        <li>{{item.fee}}</li>
                        <li>{{item.status == 1 ? '待付款':item.status == 2 ? '已关闭':item.status == 3 ? '已付款':item.status == 4 ? '已完成':''}}</li>
                        <li class="btn">
                            <Button type="text" :loading="false" class="blue" @click="$router.push(`/c2cDetail?id=${item.id}`)">交易详情</Button><br/>
                            <Button type="text" :loading="false" class="blue" v-if="item.status == 1 && item.type == 1">支付</Button>
                            <Button type="text" :loading="false" class="blue" v-if="item.status == 3 && item.type == 2">确认转账</Button>
                        </li>
                        <li class="info">
                            <time>时间：</time> <span style="margin:0 20px;color:#aaa;">|</span> <span class="blue">{{localDate(item.createtime)}}</span>  
                        </li>
                    </ul>
                </dd>
            </dl>
        </div>
        <div class="pageList">
            <page :page="page && page" @pageChange="pageChange" v-if="page.totalPage > 0" />
        </div>

        <!-- <load v-if="loading" /> -->
        
    </section>
    </section>
    
</template>

<script>
    import bigNum from "bignumber.js"    
    import dayjs from 'dayjs'
    const dayformat = 'YYYY/MM/DD'
    export default {
        name: "index",
        data (){
            return {
                searchTxt:{
                    date:['',''],
                    status:null,
                    id:null,
                    transferType:null,
                    coin:null,
                    fCoin:null,
                },
                page : {
                    currPage : 1,
                    totalPage : 1,
                    pageSize : 10,
                    totalCount : 10,
                },
                type: [
                    {
                        value: 'buy',
                        label: '购买'
                    },
                    {
                        value: 'sell',
                        label: '售出'
                    }
                ],
                status:[ 
                    {
                        value:1,
                        label:'待付款'
                    },
                    {
                        value:2,
                        label:'已关闭'
                    },
                    {
                        value:3,
                        label:'已付款'
                    },
                    {
                        value:4,
                        label:'已完成'
                    },
                    {
                        value:5,
                        label:'申诉中'
                    },
                ],
                coinList:[],
                currencyList:[],
                orderListArrary:[]
            };
        },
        watch : {
        },
        computed : {
           searchList(){
                let date
                if(this.searchTxt.date){
                    if(this.searchTxt.date[0] == ''){
                        date == null
                    }else{
                        date = `${dayjs(this.searchTxt.date[0]).format(dayformat)}~${dayjs(this.searchTxt.date[1]).format(dayformat)}`
                    }
                }else{
                    date = null
                }
                let val = [date,this.searchTxt.status, this.searchTxt.id, this.searchTxt.transferType , this.searchTxt.coin , this.searchTxt.fCoin]
                return val
            }
        },
        created (){
            this.axios({
                url : this.api.basicCoin,
                data : {
                }
            }).then(res=>{
                this.coinList = res.data.coin_list
                this.currencyList = res.data.currency_list
            }).catch( err=>{
                console.log(err)
            })
            this.orderList()
        },
        mounted(){

        },
        methods : {
            handleSearch(){
                this.orderList()
                this.closeSearch()
            },
            delSearchTxt(index){
                this.searchTxt[Object.keys(this.searchTxt)[index]] = null
            },
            showSearch(){
               this.$refs.searchBox.handleMouseenter()
            },
            closeSearch(){
                this.$refs.searchBox.handleMouseleave() 
            },
            allClear(){
                this.searchTxt.fCoin = null
                this.searchTxt.status = null
                this.searchTxt.id = null
                this.searchTxt.transferType = null
                this.searchTxt.coin = null
                this.searchTxt.date = null              
            },
            orderList(){
                let params ={
                    order_id:this.searchTxt.id,//订单编号
                    symbol:this.searchTxt.coin,//币种
                    type:this.searchTxt.transferType == 'buy' ? 1:2,//类型 1=购买 2=售出
                    status:this.searchTxt.status,//状态  1=待付款 2=已关闭 3=已付款  4=已完成 5=申诉中
                    start_time:this.searchTxt.date[0] && dayjs(this.searchTxt.date[0]).format("YYYY-MM-DD"),//开始时间
                    end_time:this.searchTxt.date[1] && dayjs(this.searchTxt.date[1]).format("YYYY-MM-DD"),//结束时间
                    currency:this.searchTxt.fCoin,//法币,
                }
                this.axios({
                    url : this.api.orderList,
                    data : {
                        ...this.page,
                        ...params
                    }
                }).then(res=>{
                    this.orderListArrary = res.data.list
                    this.page = res.data.page
                }).catch( err=>{
                    console.log(err)
                })
            },
            pageChange(page){
                this.page = page
                this.orderList()
            },
            
        },
    }
</script>

<style lang="scss" scoped>

    .c2cindex{
        background:#fff;
        padding:15px;
        min-height:80vh;
        box-shadow:0 0 10px rgba(0, 0, 0, .1)
    }
    .coin{
        background: #F6F4F5;
        line-height:60px;
        height:60px;
        border-bottom:2px solid #E3E3E3;
        margin-bottom:20px;
        .tit{
            float: left;
            width:70%;
            a{
                display:inline-block;
                width:150px;
                text-align: center;
                color:#000;
                &:hover, &.cur{
                    color:#FF6600;
                    background: #EEEEEE;
                }
            }
        }
        .search{
            float: right;
            line-height: 40px;
            height: 40px;
            width: 30%;
            border:1px solid #CDCDCD;
            background: #fff;
            position: relative;
            top:10px;
            right:10px;
            cursor: text;
            &:hover{
                border-color: #FF6600;
            }
            .ivu-poptip{
                position: absolute;
                right:0;
                top:0;
                height:40px;
            }
            .box{
                display:inline-block;margin-left:10px;
                width:calc(100% - 65px);
                white-space: nowrap;
                height:30px;
                overflow: hidden;
                span{
                    display: inline-block;padding:2px 10px;background:#ddd;border-radius:2px;line-height:20px;
                    font-size:10px;margin-right:5px;
                    cursor: auto;
                    opacity:.8;
                    &:hover{
                        opacity:1;
                    }
                    .close{
                        margin-left:5px;
                        cursor: pointer;
                    }
                }
            }
            .btn{
                padding:6px;
                border:1px solid rgba(255,255,255,0);
                border-left-color:#CDCDCD;
                cursor: pointer;
                width:45px;
                font-weight:bold;
                text-align:center;
                position: relative;
                z-index:999;
                &:hover{
                    color:#FF6600;
                    border-left-color:#FF6600;
                }
            }
            .select{
                tr{
                    height:50px;
                    line-height: 50px;
                    td{
                        font-size:14px;
                    }
                }
                cursor: default;
            }
        }
    }
    .list{
        ul{position: relative;}
        li{
            float: left;white-space:nowrap;text-overflow: ellipsis;overflow: hidden;
            .iconfont{font-size:22px;margin-right:5px;}
            &:nth-child(1){width:18%}
            &:nth-child(2){width:7%}
            &:nth-child(3){width:15%}
            &:nth-child(4){width:15%}
            &:nth-child(5){width:15%}
            &:nth-child(6){width:12%}
            &:nth-child(7){width:8%}
            &:nth-child(8){width:10%;}
            &.btn{
                position:absolute;right:0;top:0;
            }
            &.info{
                clear:both;width:100%;text-align: left;border-top:1px dashed #A9A9A9;
                time{color:#aaa}
            }
        }
        dt{
           background: #F8F8F8;
           overflow: hidden;
           height:50px;
           line-height: 50px;
           text-align:center;
        //    border:1px dashed #333;
        }
         dd{
            overflow: hidden;
            line-height: 50px;
            text-align: center;
            &:nth-child(odd){
                background: #F8F8F8
            }
            
            &:hover{background: #eee}
            li{padding:0 15px;
                &:first-child{
                    text-align: left;
                }
            }
            
        }
    }
    .ivu-btn-text{
        padding:8px 12px;
    }
    .pageList{
        margin:30px auto;
        width: 100%;
    }
</style>
