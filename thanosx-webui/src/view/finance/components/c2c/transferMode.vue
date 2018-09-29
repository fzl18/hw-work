<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].transferMode}}</span>
        </financeHeader>
        <div style="margin:10px 0">
            <span class="org">*</span> 转账方式主要为设置c2c交易时接收资金的收付款账户，请务必使用您本人实名账户信息。
        </div>
        <section class="card">
            <span class="flag">必填</span>
            <Row class="row" :class="active == 'bank'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-yinxingqia org" /> 银行卡</Col>
                <Col span="20" class="name"> 工商银行 
                    <span style="float:right;">
                        <template>
                            <Button v-if="active != 'bank'" size="large" type="primary" @click="active = 'bank'">绑定</Button>
                            <Button v-if="active == 'bank'" size="large" type="primary" @click="active = null">取消</Button>
                        </template>
                        <template>
                            <Button v-if="active != 'bank'"  size="large" type="text" @click="active = 'bank'">修改</Button>
                            <Button v-if="active == 'bank'"  size="large" type="text" @click="active = null">取消</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'bank' ">
                    <table>
                        <tr>
                            <td>开户名</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td>开户银行</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td>开户支行</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td>银行卡号</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td>确认卡号</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary"> 保存 </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
            <Row class="row" :class="active == 'alipay'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-ZFBZD blue" /> 支付宝</Col>
                <Col span="20" class="name"> 工商银行 
                    <span style="float:right;">
                        <template>
                            <Button v-if="active != 'alipay'" size="large" type="primary" @click="active = 'alipay'">绑定</Button>
                            <Button v-if="active == 'alipay'" size="large" type="primary" @click="active = null">取消</Button>
                        </template>
                        <template>
                            <Button v-if="active != 'alipay'" size="large" type="text" @click="active = 'alipay'">修改</Button>
                            <Button v-if="active == 'alipay'" size="large" type="text" @click="active = null">取消</Button>
                            <Button size="large" type="text" @click="active = null">解绑</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'alipay' ">
                    <table>
                        <tr>
                            <td>姓名</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td>支付宝账号</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <div class="qr">
                                    <div class="pic">
                                        <uploadFile path="nameAuth" v-model="alipayQR" :class="alipayQR.state == getStateStart ? 'focus' : ''">
                                            <i class="iconfont icon-erweima"></i>
                                            <em :style="{backgroundImage : 'url(' + alipayQR.origin + ')'}"></em>
                                            <div class="progress" v-if="alipayQR.state == getStateStart">
                                                <b :style="{height : alipayQR.progress + '%'}"></b>
                                                <div>{{alipayQR.progress + '%'}}</div>
                                            </div>
                                            <!-- <div class="btn"><span>{{lang[local].uploadpicbtn}}</span></div> -->
                                        </uploadFile>
                                    </div>
                                    <div>支付宝收款二维码显示区域</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary"> 保存 </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
            <Row class="row" :class="active == 'wxpay'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-ai-weixin green" /> 微信支付</Col>
                <Col span="20" class="name"> 工商银行 
                    <span style="float:right;">
                        <template>
                            <Button v-if="active != 'wxpay'" size="large" type="primary" @click="active = 'wxpay'">绑定</Button>
                            <Button v-if="active == 'wxpay'" size="large" type="primary" @click="active = null">取消</Button>
                        </template>
                        <template>
                            <Button v-if="active != 'wxpay'" size="large" type="text" @click="active = 'wxpay'">修改</Button>
                            <Button v-if="active == 'wxpay'" size="large" type="text" @click="active = null">取消</Button>
                            <Button size="large" type="text" @click="active = null">解绑</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'wxpay' ">
                    <table>
                        <tr>
                            <td>姓名</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td>微信账号</td>
                            <td><Input size="large" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <div class="qr">
                                    <div class="pic">
                                        <uploadFile path="nameAuth" v-model="wxpayQR" :class="wxpayQR.state == getStateStart ? 'focus' : ''">
                                            <i class="iconfont icon-erweima"></i>
                                            <em :style="{backgroundImage : 'url(' + wxpayQR.origin + ')'}"></em>
                                            <div class="progress" v-if="wxpayQR.state == getStateStart">
                                                <b :style="{height : wxpayQR.progress + '%'}"></b>
                                                <div>{{wxpayQR.progress + '%'}}</div>
                                            </div>
                                            <!-- <div><span>{{lang[local].uploadpicbtn}}</span> </div> -->
                                        </uploadFile>
                                    </div>
                                    <div>微信收款二维码显示区域</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary"> 保存 </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
        </section>
    </section>
</template>

<script>
export default {
    data(){
        return{
            active:null,
            bank:{
                name:'',
                card:'',
                type:'',
            },
            alipay:{

            },
            wxpay:{},
            wxpayQR:{},
            alipayQR:{}
        }
    }
}
</script>

<style lang="scss" scoped>
    .card{        
        line-height:50px;
        position: relative;
        margin-bottom:20px;      
        .flag{position:absolute;top:0;left:0;background: red;display:block;padding:5px;color:#fff;z-index:999;font-size:12;line-height:12px;}
        .row{            
            margin-top:15px;
            border-bottom:2px solid #E3E3E3;
            background: #F6F4F5;
            font-size:16px;
            line-height:70px;
            &.cur, &:hover{
                border:1px solid #FF6600
            }
            .type{
                text-align:center;
                font-weight:bold;
                background: #F0F0F0;
                height:68px;
            }
            .name{
                padding:0 30px;
            }
            .con{                
                border-top:2px solid #E3E3E3;
                table{
                    margin:20px auto;
                    width:40%;
                    td{
                        padding-right:10px;
                        .qr{
                            background: #EDEDED;
                            border:1px solid #dddee1;
                            text-align:center;
                            padding:30px;
                            .pic{
                                position: relative;
                                .iconfont{
                                    font-size:150px;
                                    position:absolute;
                                    top:30%;
                                    left:26%;
                                    opacity:.5;
                                }                                
                            }
                            em{
                                height:200px;
                                width:200px;
                                display:block;
                                background-size: cover;
                                margin:0 auto;
                                position: relative;
                                z-index:88;
                                cursor: pointer;
                            }
                        }
                    }                    
                }
            }
        }
    }
    
    .iconfont{font-size:26px;font-weight:normal;margin-right:10px;position: relative;top:3px;}
</style>
