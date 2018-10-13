<template>
    <section class="detail">
        <div class="left">
            <financeHeader :hint="false">
                <span>C2C订单 > <span style="color:#FF6500">订单详情</span></span>
            </financeHeader>
            <section>
                <div class="info">
                    <div class="price">
                        <span>{{ orderInfo.type == 1 ? '购买':'售出'}}：<span class="buy">{{orderInfo.amount}} {{orderInfo.symbol && orderInfo.symbol.toUpperCase()}}</span></span>
                        <span style="margin-left:40px">总价：<span class="org">{{orderInfo.money}} {{orderInfo.currency}}</span></span>
                        <span style="margin-left:20px">（单价：{{orderInfo.price}}{{orderInfo.currency}}）</span>
                    </div>
                    <div class="user">
                        <p>交易卖方：{{orderInfo.nickname}}（UID：{{orderInfo.user_id}}）</p>
                        <p>真实姓名：{{orderInfo.realname}} ({{orderInfo.phone}})</p>
                    </div>
                </div>
                <div class="transferType">
                    <div class="tit">
                        卖方付款方式：
                    </div>
                    <div class="card" v-if="orderInfo.status!=2">
                        <div v-if="orderInfo.bank_card" @click="handlePayType('bank')" >
                            <Row class="type" :class="payType =='bank' ? 'cur':''">
                                <Col span="4" class="bg"><i class="iconfont icon-yinxingqia org"></i> 银行卡</Col>
                                <Col span="4" style="padding-left:15px">{{orderInfo.realname}}</Col>
                                <Col span="8">{{orderInfo.bank_card}}</Col>
                                <Col span="4">{{orderInfo.bank_name}}</Col>
                                <Col span="4">{{orderInfo.bank_branch}}</Col>
                            </Row>
                        </div>
                        <div v-if="orderInfo.alipay_account" @click="handlePayType('alipay')">
                            <Row class="type" :class="payType =='alipay' ? 'cur':''">
                                <Col span="4" class="bg"><i class="iconfont iconfont icon-ZFBZD blue"></i>支付宝</Col>
                                <Col span="4" style="padding-left:15px">{{orderInfo.wxpay_name}}</Col>
                                <Col span="8">支付宝账号：{{orderInfo.alipay_account}}</Col>
                                <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">查看二维码</Button></Col>
                                <Col span="4"></Col>
                            </Row>
                        </div>
                        <div v-if="orderInfo.wxpay_account" @click="handlePayType('wxpay')">
                            <Row class="type" :class="payType =='wxpay' ? 'cur':''">
                                <Col span="4" class="bg"><i class="iconfont icon-ai-weixin green"></i>微信支付</Col>
                                <Col span="4" style="padding-left:15px">{{orderInfo.wxpay_name}}</Col>
                                <Col span="8">微信付款账号：{{orderInfo.wxpay_account}}</Col>
                                <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">查看二维码</Button></Col>
                                <Col span="4"></Col>
                            </Row>
                        </div>                        
                    </div>
                    <div class="card" v-if="orderInfo.status==2">
                        <div>
                            <Row class="type none">
                                <Col span="24" class="bg">订单已关闭，无法查看卖方收款信息</Col>
                            </Row>
                        </div>                       
                    </div>
                    <div class="payinfo" v-if="orderInfo.status==3">已付款，请在 <span class="sell">{{leftTime}}</span>  内确认收款并放币</div>
                    <div class="pay">付款代码： <span>{{orderInfo.code}}</span> （买家将在付款单中备注付款代码）</div>
                    <div class="btn" v-if="orderInfo.status==4"><h2>已完成</h2></div>
                    <div class="btn" v-if="orderInfo.status==2"><h2>已关闭</h2></div>
                    <div class="btn" v-if="orderInfo.status==3 && orderInfo.type == 2"><Button @click="payModal=true" type="primary" size="large">收款，放币</Button><Button type="text" size="large" class="blue">客服申诉</Button></div> 
                    <div class="btn" v-if="orderInfo.status==1 && orderInfo.type== 2">
                        <Button type="primary" size="large" disabled>对方正在付款...</Button>
                    </div>
                    <div class="btn" v-if="orderInfo.status==3 && orderInfo.type== 1">
                        <Button type="primary" size="large" disabled>对方正在放币...</Button>
                    </div> 
                    <div class="btn" v-if="orderInfo.status==1 && orderInfo.type==1"><Button type="primary" size="large" @click="payModal = true">去付款</Button><Button type="text" size="large" class="blue" @click="cancelOrder">取消订单</Button></div>                    
                    <p style="margin-top:15px">本次交易请务必查看  <a href="#" target="_blank" class="org">服务协议</a></p>
                </div>
                <div class="faq">
                    <div class="tit">常见问题 <i class="iconfont icon-wenhao"></i></div>
                    <ul>
                        <li :class="curFaq == 1 ? 'cur':''" @click="curFaq = 1">
                            <p class="ask"><i class="iconfont" :class="curFaq == 1 ? 'icon-fangxiang':'icon-fangxiang1'"></i>给卖家付款安全吗？</p>   
                            <p class="ctx">当你进入交易时，卖家的数字资产会被锁定在平台的钱包中，因此不必担心给卖家付款。如果卖家在您付款5分钟后还未放行数字资产，点击‘申诉’按钮，我们的客服团队将会帮助您。</p>
                        </li>
                        <li :class="curFaq == 2 ? 'cur':''" @click="curFaq = 2">
                            <p class="ask"><i class="iconfont" :class="curFaq == 2 ? 'icon-fangxiang':'icon-fangxiang1'"></i>我什么时候能收到币？</p>   
                            <p class="ctx">请反复确认是否收到对方款项，不要相信任何催促放币的理由，确认收到款项后再放行数字资产，避免造成损失！
                                买方的打款银行账户与平台账户的实名不一致时，请注意收款风险，如有疑问，请及时申诉。</p>
                        </li>
                        <li :class="curFaq == 3 ? 'cur':''" @click="curFaq = 3">
                            <p class="ask"><i class="iconfont" :class="curFaq == 3 ? 'icon-fangxiang':'icon-fangxiang1'"></i>转款注意事项</p>   
                            <p class="ctx">请反复确认是否收到对方款项，不要相信任何催促放币的理由，确认收到款项后再放行数字资产，避免造成损失！
                                买方的打款银行账户与平台账户的实名不一致时，请注意收款风险，如有疑问，请及时申诉。</p>
                        </li>
                        <li :class="curFaq == 4 ? 'cur':''" @click="curFaq = 4">
                            <p class="ask"><i class="iconfont" :class="curFaq == 4 ? 'icon-fangxiang':'icon-fangxiang1'"> </i>常见收款风险</p>   
                            <p class="ctx">请反复确认是否收到对方款项，不要相信任何催促放币的理由，确认收到款项后再放行数字资产，避免造成损失！
                                买方的打款银行账户与平台账户的实名不一致时，请注意收款风险，如有疑问，请及时申诉。</p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>   
        <div class="right">
            <p class="tit">订单信息</p>
            <table>
                <tr>
                    <td width="100">订单编号：</td>
                    <td>{{orderInfo.orderid}}</td>
                </tr>
                <tr>
                    <td>订单状态：</td>
                    <td class="torg">{{orderInfo.status==1?'待付款':orderInfo.status==2?'已关闭':orderInfo.status==3?'已付款':orderInfo.status==4?'已完成':'申诉中'}}</td>
                </tr>
                <tr>
                    <td colspan="2" class="border"></td>
                </tr>
                <tr>
                    <td style="padding-top:15px">下单时间：</td>
                    <td style="padding-top:15px">{{localDate(orderInfo.createtime)}}</td>
                </tr>
            </table>
        </div>
        <Modal
            v-model="payModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">            
            <Row class="payModal" v-if="orderInfo.type==2">
                <Col span="18"><h1>确认放币</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="12" class="f15">放币数量</Col>
                <Col span="12" class="f15">收款金额</Col>
                <Col span="12" class="torg">{{orderInfo.amount}} {{orderInfo.symbol && orderInfo.symbol.toUpperCase()}}</Col>
                <Col span="12" class="torg">{{orderInfo.money}} {{orderInfo.currency}}</Col>
                <Col span="24" style="margin:20px 0"><hr></Col>
                <Col span="24" class="f15">交易买方</Col>
                <Col span="6" offset="2" ><b>真实姓名</b> </Col>
                <Col span="16"><b>{{orderInfo.realname}}</b> </Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" class="f15">交易确认</Col>
                <Col span="22" offset="2">
                    <Row class="input">
                        <Col span="12">可用：</Col>
                        <Col span="12">6.00098 ETH</Col>
                        <Col span="12">交易密码</Col>
                        <Col span="12"><Input v-model="payPassword" size="large"/></Col>
                        <Col span="12">验证码</Col>
                        <Col span="12" style="margin-top:8px;"><Input v-model="emailVerify" size="large" placeholder="邮件验证码" clearable ><span slot="append" class="blue cursor" @click="sendCode">{{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}</span></Input></Col>
                    </Row>
                </Col>
                <Col span="24" style="margin:20px 0"><hr></Col>
                <Col span="24" >已登录收款账户，并核对收款无误</Col>
                <Col span="24" class="sell">请务必核实收款，否则确认放币后资产不可收回！</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12"><Button type="text" size="large" @click="payModal = false">未收款</Button></Col>
                <Col span="12"><Button type="primary" size="large" @click="confirmReceivable">确认</Button></Col>
            </Row>
            <Row class="payModal" v-if="payType == 'bank' && orderInfo.type==1">
                <Col span="18"><h1>确认收款</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" class="f15">支付金额</Col>
                <Col span="24" class="tbuy">{{orderInfo.money}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:20px 0"><hr></Col>                
                    <Row>
                        <Col span="24">
                            <Row >
                                <Col span="24" class="f15">对方 银行卡 </Col>
                                <Col span="24" class="tblue">{{orderInfo.bank_card}}</Col>
                                <Col span="8">{{orderInfo.realname}}</Col>
                                <Col span="8">{{orderInfo.bank_name}} </Col>
                                <Col span="8">{{orderInfo.bank_branch}}</Col>
                                <Col span="24" class="f15"> 付款代码 <span style="font-size:12px">(请在付款单中备注付款代码)</span> </Col>
                                <Col span="8" class="f15 torg">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                    </Row>                
                <Col span="24" style="margin:20px 0"><hr></Col>
                <Col span="24" class="sell">请本人实名付款，否则存在交易风险！</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12"><Button type="text" size="large" @click="payModal = false">未收款</Button></Col>
                <Col span="12"><Button type="primary" size="large" @click="confirmPay">已付款</Button></Col>
            </Row>
            <Row class="payModal" v-if="payType != 'bank' && orderInfo.type==1 ">
                <Col span="18"><h1>确认收款</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" class="f15">支付金额</Col>
                <Col span="24" class="tbuy">{{orderInfo.money}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:20px 0"><hr></Col>                
                    <Row>
                        <Col span="16">
                            <Row v-if="payType == 'alipay'">
                                <Col class="f15">对方 支付宝</Col>
                                <Col class="tblue">{{orderInfo.alipay_account}}</Col>
                                <Col><b>{{orderInfo.realname}}</b> </Col>
                                <Col class="f15"> 付款代码 <span style="font-size:12px">(请在付款单中备注付款代码)</span> </Col>
                                <Col class="f15 torg">{{orderInfo.code}}</Col>
                            </Row>
                            <Row v-if="payType != 'alipay'">
                                <Col class="f15">对方 微信账号 </Col>
                                <Col class="tblue">{{orderInfo.wechat_account}}</Col>
                                <Col><b>{{orderInfo.wxpay_name}}</b> </Col>
                                <Col class="f15"> 付款代码 <span style="font-size:12px">(请在付款单中备注付款代码)</span> </Col>
                                <Col class="f15 torg">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <Col v-if="payType == 'alipay'" span="6" offset="2"><img :src="orderInfo.alipay_image" alt="" style="width:120px;height:120px"></Col>
                        <Col v-if="payType != 'alipay'" span="6" offset="2"><img :src="orderInfo.wechat_image" alt="" style="width:120px;height:120px"></Col>
                    </Row>                
                <Col span="24" style="margin:20px 0"><hr></Col>
                <Col span="24" class="sell">请本人实名付款，否则存在交易风险！</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12"><Button type="text" size="large" @click="payModal = false">未收款</Button></Col>
                <Col span="12"><Button type="primary" size="large" @click="confirmPay">已付款</Button></Col>
            </Row>
        </Modal>
        <Modal
            v-model="qrModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>收款二维码</h1>
            <hr style="margin-top:20px">
            <img v-if="payType == 'alipay'" :src="orderInfo.alipay_image" alt="" style="width:250px;height:250px;margin:40px auto;display:block;">
            <img v-if="payType != 'alipay'" :src="orderInfo.wxpay_image" alt="" style="width:250px;height:250px;margin:40px auto;display:block;">
            <div style="text-align:center">
                <Button type="primary" size="large" @click="qrModal = false">关闭</Button>
            </div>
        </Modal>
    </section>
</template>

<script>
export default {
    data(){
        return{
            active:null,
            payType:'bank',
            payModal:false,
            qrModal:false,
            bank:{
                name:'',
                card:'',
                type:'',
            },
            alipay:{

            },
            wxpay:{},
            wxpayQR:{},
            alipayQR:{},
            orderInfo:{},
            transferMode:{},
            curFaq:1,
            sendCodeStatus:false,
            sendCodeCount:0,
            emailVerify:'',
            payPassword:'',
            leftTime:''
        }
    },
    mounted(){
        this.orderDetail()
    },
    methods:{
        handlePayType(val){
            this.payType = val
            
        },
        seeQR(){
            this.qrModal = true;
        },
        orderDetail(){
            this.axios({
                url : this.api.orderDetail,
                data : {
                    id:this.$route.query.id
                }
            }).then(res=>{
                this.orderInfo = res.data.info
                // this.transferMode = res.data.info.transfer_mode
                console.log(res.data.info.time);
                let time = res.data.info.time
                if(time > 0){
                    setInterval(()=>{
                        let M = Math.floor(time/60%60)
                        let S = Math.floor(time%60)
                        this.leftTime = `${M}:${S}`
                        time--
                        if(!M && !S){
                            clearInterval()
                            this.orderDetail()
                        }
                    },1000) 
                }
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        cancelOrder(){
            this.axios({
                url : this.api.cancelOrder,
                data : {
                    id:this.orderInfo.id
                }
            }).then(res=>{
                this.orderDetail()
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        confirmPay(){
            this.axios({
                url : this.api.confirmPay,
                data : {
                    id:this.orderInfo.id
                }
            }).then(res=>{
                this.payModal = false
                this.$store.commit('msg/add', res.message);
                this.orderDetail()
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        confirmReceivable(){
            this.axios({
                url : this.api.confirmReceivable,
                data : {
                    id:this.orderInfo.id,
                    password:this.payPassword,
                    code:this.emailVerify,
                }
            }).then(res=>{
                this.payModal = false
                this.$store.commit('msg/add', res.message);
                this.orderDetail()
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        sendCode(){
            if(this.verifyCodeTimeText){
                return false;
            };
            this.verifyCodeTimeText = -1;
            this.axios({
                url : this.api.sendCaptcha,
                data : {
                    type:8,
                }
            }).then((res) => {
                this.sendCodeStatus = true;
                this.sendCodeCount ++;
                this.verifyCodeDown();
            }).catch((err) => {
                this.$store.commit('msg/err', err.message);
                this.verifyCodeTimeText = '';
                this.sendCodeStatus = false;
            });
            return true;
        },
    }
}
</script>

<style lang="scss" scoped>
    .detail{
        margin-top:60px;
        overflow: hidden;
        min-height:80vh;
        .left{
            background:#fff;
            box-shadow:0 0 8px rgba(0,0,0,.3);
            padding:15px 30px;
            float: left;
            width:calc(100% - 335px);
            .tit{
                font-weight: bold;
                font-size:16px;
            }
            .info{
                .price{
                    font-size:20px;
                    font-weight:bold;
                    margin-top: 20px;
                }
                .user{                    
                    border-top:1px dashed #ccc;
                    border-bottom:1px dashed #ccc;
                    margin:20px 0;
                    padding:10px 0;
                    p{
                        line-height: 40px;
                    }
                }
            }
            .transferType{
                .card{
                    white-space:nowrap;
                    text-overflow:hidden;
                    overflow: hidden;                    
                    .type{
                        border-bottom:2px solid #E4E4E4;
                        background: #F7F7F7;
                        height:60px;
                        line-height:60px;
                        margin-top:20px;
                        cursor: pointer;
                        .bg{
                            background: #EFEFEF;
                            text-align: center;
                            height: 58px;
                        }
                        &:hover, &.cur{
                            border:1px solid #FF6600;
                        }
                        &.none{
                            border:none;
                            cursor:default;
                        }
                        &.cur{
                            .iconfont{
                                color:#fff;
                            }
                            .bg{
                                background: #FF6600;
                                color:#fff;
                            }
                        }
                        
                    }
                }
                .payinfo{
                    font-size:16px;
                    font-weight: bold;
                    margin-top:20px;
                }
                .pay{
                    font-size:15px;
                    margin:30px 0;
                    overflow: hidden;
                    span{
                        background: #959595;color:#fff;padding:5px 15px;display: inline-block;
                    }
                }
            }
            .faq{
                margin:100px 0 30px 0;
                .iconfont{
                    font-size:20px;
                    top:1px;
                }
                li{
                    margin:15px 0;
                    line-height:26px;                    
                    .ask{
                        font-size:15px;font-weight:bold;
                        cursor: pointer;
                    }
                    .ctx{
                        margin-left:40px;
                        display: none;
                    }
                    &.cur{
                        .ask{
                            color: #0095FD;
                        }
                        .ctx{
                            display:block;
                        }
                    }                    
                }

            }
        }
        .right{
            background:#fff;
            box-shadow:0 0 8px rgba(0,0,0,.3);
            padding:25px 30px;
            float: left;
            margin-left:15px;
            width:320px;
            .tit{font-size:20px;color: #8E8E8E;margin-bottom:15px;}
            table{
                width:100%;
                tr{
                    & td:first-child{
                        text-align:right;
                    }
                }
                td{
                    height:40px;
                    line-height: 40px;
                    font-size:15px;
                    &.border{border-bottom:1px dotted #ccc;height:1px;line-height: 1px;padding-bottom:15px}

                }
            }
        }
    }
    .payModal{
        font-size:16px;
        line-height: 30px;
        .leftTime{
            color:#FF6600;font-size:16px;font-weight: bold
        }
        .input{
            color:#A6A6A6;
            font-size:15px;
            div{
                min-height:36px;
                line-height:36px;
            }
        }
    }
    .f15{
        font-size:15px;
    }
    .cursor{
        cursor: pointer;
    }
    .iconfont{font-size:26px;font-weight:normal;margin-right:10px;position: relative;top:3px;}
</style>
