<template>
<div class="c2c">
    <section class="c2cindex container">
        <ul class="type">
            <li @click="handleClass('buy')" :class="curType =='buy' ? 'cur':''">购买</li>
            <li @click="handleClass('sell')" :class="curType =='sell' ? 'cur':''">售出</li>
            <li @click="handleClass('myOrder')" :class="curType =='myOrder' ? 'cur':''">我的委托单</li>
        </ul>
        <div class="seller" v-if="curType == 'myOrder'">
            <Row>
                <Col span="12" class="lt">
                    <h2>商家名称002 <i class="iconfont icon-bianji org" style="font-size:22px;cursor: pointer;margin:0 20px" @click="editBizName = true"/></h2>
                    <div>入驻时间：2018-05-62 14：25：33</div>
                </Col>
                <Col span="12" class="rt">
                    <ul>
                        <li><span>1000W TNSX</span><br/>商家保证金</li>
                        <li><span>3</span><br/>近30天成单</li>
                        <li><span>30</span><br/>总成单</li>
                        <li><span>20%</span><br/>总成单率</li>
                    </ul>
                </Col>
            </Row>
        </div>
        <div class="coin">
            <div class="tit" v-if="curType != 'myOrder'">
                <a v-for="(item,index) in coinList" href="javascript:;" @click="changeCoin(index)" :class="curCoin == index ?'cur':''">{{item}}</a>
            </div>
            <div class="tit" v-if="curType == 'myOrder'">
                <Button @click="addOrder" size="large" type="primary" ><i class="iconfont icon-tianjia" style="fontSize:20px;margin-right:10px;"/> 添加委托单</Button>
                <Button size="large" type="primary" :disabled="false" style="background:#777;color:#fff;" @click="$router.push('/apply')"> <i class="iconfont icon-tianjia" style="fontSize:20px;margin-right:10px;"/>  商家申请 </Button>
                <div class="tip"> <span class="torg">审核未通过！</span>  理由为：应该</div>
            </div>            
            <div class="search" @click="showSearch">
                <div class="box">
                    <template v-for="(item,index) in searchList">
                        <span v-if="item">{{item}} <Icon type="close" size="12" class="close" @click="delSearchTxt(index)"/></span>
                    </template>
                </div>
                <Poptip trigger="hover" placement="bottom-end" ref="searchBox" :width=460>
                    <Icon type="ios-search" size="26" class="btn"/>
                    <div class="api" slot="content">
                        <table class="select" >
                            <tbody>

                                <template v-if="curType != 'myOrder'">
                                    <tr>
                                        <td>法币币种：</td>
                                        <td>
                                            <Select v-model="searchTxt1.fCoin" size="large" style="width:300px">
                                                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>支付方式：</td>
                                        <td>
                                            <Select v-model="searchTxt1.payType" size="large" style="width:300px">
                                                <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="curType == 'myOrder'">
                                    <tr>
                                        <td>日期：</td>
                                        <td>
                                            <DatePicker v-model="searchTxt2.date" size="large" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 300px"></DatePicker>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>交易类型：</td>
                                        <td>
                                            <Select v-model="searchTxt2.transferType" size="large" style="width:300px">
                                                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>币种：</td>
                                        <td>
                                            <Select v-model="searchTxt2.coin" size="large" style="width:300px">
                                                <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>法币币种：</td>
                                        <td>
                                            <Select v-model="searchTxt2.fCoin" size="large" style="width:300px">
                                                <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                </template>
                                <tr>
                                    <td align="center">
                                        <Button size="large" type="text" class="org" @click="allClear">清空筛选</Button>
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
        <div v-if="curType == 'myOrder'" style="margin:20px 0"><span class="torg">*</span> 申请成为商家后，才可OTC交易委托</div>
        <div class="list">
            <dl :class="curType == 'myOrder'?'myOrder':''">
                <dt>
                    <ul v-if="curType != 'myOrder'">
                        <li>商家</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>操作</li>
                    </ul>
                    <ul v-if="curType == 'myOrder'">
                        <li>币种</li>
                        <li>交易类型</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>时间</li>
                        <li>操作</li>
                    </ul>
                </dt>
                <dd>
                    <ul v-if="curType != 'myOrder'">
                        <li @click="$router.push('/biz?id=11')"><span class="tblue">商家</span> (106)</li>
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
                                        <Col span="8"><Input size="large" v-model="model4" placeholder="..."><span slot="append">CNY</span></Input></Col>
                                        <Col span="2" style="line-height: 36px;text-align: center;"><i class="iconfont icon-jiaohuan" /></Col>
                                        <Col span="8"><Input size="large" v-model="model4" placeholder="E..."><span slot="append" class="blue">全部</span></Input></Col>
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
                                    <Row v-if="curType =='sell'">
                                        <Col span="8" style="margin-top:8px;"><Input size="large" placeholder="..." clearable ><span slot="append" class="blue">获取验证码</span></Input></Col>
                                        <Col span="8" offset="2"><Input size="large" placeholder="..." clearable /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row class="n2">
                                <Col span="3"><i class="iconfont icon-yinxingqia org" /> 银行卡</Col>
                                <Col span="3"><i class="iconfont icon-ai-weixin buy" /> 微信支付</Col>
                                <Col span="3"><i class="iconfont icon-ZFBZD blue" /> 支付宝支付</Col>
                                <Col span="16"> <span style="color:red">*</span> 备注备注备注备注备注备注备注备注备注备注备注备注备注</Col>
                                <Col span="8" style="textAlign:right">买方付款时限为<span class="torg">30</span>分钟</Col>
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
                <dd>
                    <ul v-if="curType != 'myOrder'">
                        <li><span>商家</span> (106)</li>
                        <li>5665599.00000 BTC</li>
                        <li>199.990~52236.000 CNY</li>
                        <li class="tbuy">6.88CNY</li>
                        <li>ssdfe</li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(1)">{{curType == 'buy' ? `购买 BTC` : `售出 BTC`}}</Button></li>
                        <li v-if="checkMore == 1" class="more">                            
                            <Row>
                                <Col span="4">商家00655 (256)</Col>
                                <Col span="4" class="tbuy">6.88 CNY</Col>
                                <Col span="12">
                                    <Row>
                                        <Col span="8"><InputNumber v-model="model4" style="width:100%" placeholder="数量"/></Col>
                                        <Col span="8" offset="2"><InputNumber v-model="model4" style="width:100%" placeholder="E..."/></Col>
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
        <Modal
            v-model="addOrderModal"
            :closable = false
            :footer-hide = true
            width="1000"
            class-name="vertical-center-modal">
            
            <addOrder @ok="ok" @close="close"/>
        </Modal>
        <!-- <load v-if="loading" /> -->
        <Modal
            v-model="editBizName"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>修改商家名称</h1>
            <table class="editBizName">
                <tr>
                    <td>名称</td>
                    <td align="right"><Input size="large" v-model="business_name"/></td>
                </tr>
                <tr>
                    <td colspan="2">
                        为了隐私安全，仅在OTC交易中显示商家信息，不显示注册信息。商家最长支持10个字符   
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">
                            <Col span="12"><Button type="primary" size="large" @click="saveName">保存</Button></Col>
                            <Col span="6" offset="6"><Button type="text" size="large" @click="editBizName=false">关闭</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
    </section>
</div>
</template>

<script>
    import {mapState} from "vuex"
    import dayjs from 'dayjs'
    const dayformat = 'YYYY/MM/DD'
    export default {
        name: "list",
        data (){
            return {
                loading:true,
                curType:'buy',
                curCoin:0,
                coinList:['BTC','ETH','USDT'],
                checkMore:null,
                searchTxt1:{
                    fCoin:null,
                    payType:null,
                },
                searchTxt2:{
                    date:['',''],
                    transferType:null,
                    coin:null,
                    fCoin:null,
                },
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    }
                ],
                cityList1: [
                    {
                        value: 'New York1',
                        label: 'New York1'
                    },
                    {
                        value: 'London1',
                        label: 'London1'
                    }
                ],
                cityList2: [
                    {
                        value: 'New York2',
                        label: 'New York2'
                    },
                    {
                        value: 'London2',
                        label: 'London2'
                    }
                ],
                model4:'',
                addOrderModal:false,
                editBizName:false,
                business_name:''
            };
        },
        created (){

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
            searchList(){
                let date
                if(this.searchTxt2.date){
                    if(this.searchTxt2.date[0] == ''){
                        date == null
                    }else{
                        date = `${dayjs(this.searchTxt2.date[0]).format(dayformat)}~${dayjs(this.searchTxt2.date[1]).format(dayformat)}`
                    }
                }else{
                    date = null
                }
                let val2 = [date, this.searchTxt2.transferType , this.searchTxt2.coin , this.searchTxt2.fCoin],
                    val = [ this.searchTxt1.fCoin , this.searchTxt1.payType]
                return  this.curType == 'myOrder' ? val2 : val
            }
        },
        methods : {
            handleClass(val){
                this.curType = val
            },
            changeCoin(index){
                this.curCoin = index
            },
            delSearchTxt(index){
                if(this.curType == 'myOrder'){
                    this.searchTxt2[Object.keys(this.searchTxt2)[index]] = null
                }else{
                    this.searchTxt1[Object.keys(this.searchTxt1)[index]] = null
                }
            },
            showSearch(){
               this.$refs.searchBox.handleMouseenter()
            },
            getList(info,id){

            },
            operation(index){
                this.checkMore = index
            },
            cancel(){
                this.checkMore = null
            },
            ok(){
                this.addOrderModal = false
            },
            close(){
                this.addOrderModal = false
            },
            addOrder(){
                this.addOrderModal = true
            },
            allClear(){
                if(this.curType == 'myOrder'){
                    this.searchTxt2.fCoin = null
                    this.searchTxt2.transferType = null
                    this.searchTxt2.coin = null
                    this.searchTxt2.date = null
                }else{
                    this.searchTxt1.fCoin = null
                    this.searchTxt1.payType = null
                }
                
            },
            saveName(){
                if(!this.business_name.trim()){
                    this.$store.commit('msg/err', '名称不能为空')
                    return
                } 
                this.axios({
                    url : this.api.updateName,
                    data : {
                        business_name:this.business_name.trim()
                    }
                }).then(res=>{
                    this.$store.commit('msg/add', res.message)
                    this.editBizName=false
                })           
            }

        }
    }
</script>

<style scoped lang="scss" >
    .list{
        li{
            float: left;white-space:nowrap;
            .iconfont{font-size:22px;margin-right:5px;}
            &:nth-child(1){width:20%}
            &:nth-child(2){width:20%}
            &:nth-child(3){width:15%}
            &:nth-child(4){width:15%}
            &:nth-child(5){width:15%}
            &:nth-child(6){width:14%}
            &.more{
                width: 100%;
                background: #F8F8F8;
                border:1px solid #FBE7DC;
                margin-top:-50px;
                padding:20px 30px;
                text-align:left;
                position: relative;
                z-index:999;
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
    .editBizName{
        margin:30px auto;
        tr{
           td{
                line-height: 30px;font-size: 14px;padding:10px 0;
            } 
        }
        
    }
</style>
