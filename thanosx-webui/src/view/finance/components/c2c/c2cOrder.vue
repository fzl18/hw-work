<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].c2cOrder}}</span>
        </financeHeader>
        <section class="c2cindex">
        <div class="coin">
            <div class="search" @click="showSearch">
                <div class="box">
                    <span v-for="(item,index) in searchTxt ">{{item.val}} <Icon type="close" size="12" class="close" @click="delSearchTxt(index)"/></span>
                </div>
                <Poptip trigger="hover" placement="bottom-end" ref="searchBox" :width=460>
                    <Icon type="ios-search" size="26" class="btn"/>
                    <div class="api" slot="content">
                        <table class="select">
                            <tbody>
                                <tr>
                                    <td>国家/地区：</td>
                                    <td>
                                        <Select v-model="model4" size="large" style="width:300px">
                                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>法币币种：</td>
                                    <td>
                                        <Select v-model="model4" size="large" style="width:300px">
                                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>支付方式：</td>
                                    <td>
                                        <Select v-model="model4" size="large" style="width:300px">
                                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <Button size="large" type="text" class="org">清空筛选</Button>
                                    </td>
                                    <td align="center" >
                                        <Button size="large" type="primary">搜索</Button> <Button size="large" type="text">取消</Button>
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
                        <li>商家</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>操作</li>
                    </ul>

                </dt>
                <dd>
                    <ul v-if="curType != 'myOrder'">
                        <li><span class="tblue">商家</span> (106)</li>
                        <li>5665599.00000 BTC</li>
                        <li>199.990~52236.000 CNY</li>
                        <li class="tbuy">6.88CNY</li>
                        <li>
                            <i class="iconfont icon-yinxingqia org" />
                            <i class="iconfont icon-ai-weixin buy" />
                            <i class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(0)">{{curType == 'buy' ? `购买 BTC` : `售出 BTC`}}</Button></li>
                        <li v-if="checkMore == 0" class="more">                            
                            <Row>
                                <Col span="4">商家00655 (256)</Col>
                                <Col span="4" class="tbuy">6.88 CNY</Col>
                                <Col span="12">
                                    <Row>
                                        <Col span="8"><Input v-model="model4" style="width:100%" placeholder="..."><span slot="append">CNY</span></Input></Col>
                                        <Col span="2"><i class="iconfont icon-jiaohuan" /></Col>
                                        <Col span="8"><Input v-model="model4" style="width:100%" placeholder="E..."><span slot="append">CNY</span></Input></Col>
                                    </Row>
                                </Col>
                                <Col span="4" style="position: relative;top:20px;text-align:right">
                                    <Button size="large" type="primary">下单</Button>
                                    <Button size="large" type="text" @click="cancel">取消</Button>
                                </Col>
                                <br />
                                <Col span="4">数量：</Col>
                                <Col span="4">199.02554~3256.22155</Col>
                                <Col span="12">
                                    <Row>
                                        <Col span="8"><Input placeholder="Enter something..." clearable /></Col>
                                        <Col span="8" offset="2"><Input placeholder="Enter something..." clearable /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row class="n2">
                                <Col span="3"><i class="iconfont icon-yinxingqia org" /> 银行卡</Col>
                                <Col span="3"><i class="iconfont icon-ai-weixin buy" /> 微信支付</Col>
                                <Col span="3"><i class="iconfont icon-ZFBZD blue" /> 支付宝支付</Col>
                                <Col span="24"> <span style="color:red">*</span> 备注备注备注备注备注备注备注备注备注备注备注备注备注</Col>
                            </Row>
                        </li>                        
                    </ul>
                    <ul v-if="curType == 'myOrder'">
                        <li>BTV</li>
                        <li style="color:green">购买</li>
                        <li>199.990~52236.000 CNY</li>
                        <li>6.88CNY</li>
                        <li>ssdfe</li>
                        <li>ssdfe</li>
                        <li>时间</li>
                        <li><Button size="large" type="text" :loading="false">{{ `取消委托单`}}</Button></li>
                    </ul>
                </dd> 
            
            </dl>
        </div>

        <!-- <load v-if="loading" /> -->
    </section>
    </section>
    
</template>

<script>
    import bigNum from "bignumber.js"
    export default {
        name: "index",
        data (){
            return {
                mainChain:[],
                isChecked:false,
                cur:0,
                market2 : '',
                totalAssets : 0,
                coinSeekSatet : false,
                totalAssetsState : false,
                origin : process.env.NODE_ENV == 'development' ? 'http://47.99.115.225' : '',
                addOrderModal:false,
                transfer:false,
                transferType:''
            };
        },
        watch : {
        },
        computed : {
            seek (){
                return {market2 : this.market2};
            },
            // ismain (){
            //     return  this.mainChain.indexOf(this.item.market2) == -1
            // }
            
        },
        created (){
            this.myasset()
            this.getMainCoins()
        },
        mounted(){
            console.log(this.mainChain)
        },
        methods : {
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
            myasset (){
                this.axios({
                    url : this.api.myasset,
                }).then((res) => {
                    this.totalAssets = res.data.tol || 0;
                }).catch((err) => {
                    console.log(err);
                });
            },
            hadndleTab (index){
                this.cur = index
            },
            getMainCoins(){
                this.axios({
                    url : this.api.getMainCoins,
                    data : {
                    }
                }).then(res => {
                    this.mainChain = res.data
                    console.log(res.data)
                }).catch()
            },
            ok(){
                this.addOrderModal = false
            },
            close(){
                this.addOrderModal = false
            },
            handleTransfer(val){
                this.transferType = val
                this.transfer = true
            }
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
    ul.type{
        overflow: hidden;
        margin-bottom: 20px;
        li{
            float: left;
            font-size:16px;
            font-weight: bold;
            color:#666;
            text-align: center;
            min-width:180px;
            height:60px;
            line-height: 60px;
            padding-bottom: 10px;
            border-bottom:2px solid #CECECE;
            margin-right:10px;
            cursor: pointer;
            &:hover, &.cur{
                color:#FF6600;
                border-bottom-color: #FF6600;
            }
        }        
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
        li{
            float: left;white-space:nowrap;
            .iconfont{font-size:22px;margin-right:5px;}
            &:nth-child(1){width:25%}
            &:nth-child(2){width:20%}
            &:nth-child(3){width:15%}
            &:nth-child(4){width:15%}
            &:nth-child(5){width:15%}
            &:nth-child(6){width:10%}
            &.more{
                width: 100%;
                background: #F8F8F8;
                border:1px solid #FBE7DC;
                margin-top:-50px;
                padding:20px 30px;
                text-align:left;
                .n2{
                    border-top:1px dashed #ddd;margin-top:20px;padding-top:20px;
                    .iconfont{font-size:26px;position: relative;top:5px;margin-right:5px;}
                }
            }
        }
        dl{
            &.myOrder{
                li{
                    &:nth-child(1){width:10%}
                    &:nth-child(2){width:10%}
                    &:nth-child(3){width:15%}
                    &:nth-child(4){width:15%}
                    &:nth-child(5){width:10%}
                    &:nth-child(6){width:10%}
                    &:nth-child(7){width:20%}
                    &:nth-child(8){width:10%}
                }
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
            height:50px;
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
</style>
