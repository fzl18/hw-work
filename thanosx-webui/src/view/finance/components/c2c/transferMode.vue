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
                <Col span="20" class="name"> {{ bank.bank ? `${bank.bank } (尾号：${bank.account.slice(-4)})` : '未绑定' }}  
                    <span style="float:right;">
                        <template v-if="!bank.branch">
                            <Button v-if="active != 'bank'" size="large" type="primary" @click="active = 'bank'">绑定</Button>
                            <Button v-if="active == 'bank'" size="large" type="primary" @click="active = null">取消</Button>
                        </template>
                        <template v-if="bank.branch">
                            <Button v-if="active != 'bank'"  size="large" type="text" @click="active = 'bank'">修改</Button>
                            <Button v-if="active == 'bank'"  size="large" type="text" @click="active = null">取消</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'bank' ">
                    <table>
                        <tr>
                            <td>开户名</td>
                            <td>{{realname}}</td>
                        </tr>
                        <tr>
                            <td>开户银行</td>
                            <td><Input v-model="bank.bank" size="large" /></td>
                        </tr>
                        <tr>
                            <td>开户支行</td>
                            <td><Input v-model="bank.branch" size="large" /></td>
                        </tr>
                        <tr>
                            <td>银行卡号</td>
                            <td><Input v-model="bank.account" size="large" /></td>
                        </tr>
                        <tr>
                            <td>确认卡号</td>
                            <td><Input v-model="review" size="large" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary" @click="transferModeSet(1)"> 保存 </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
            <Row class="row" :class="active == 'alipay'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-ZFBZD blue" /> 支付宝</Col>
                <Col span="20" class="name"> {{ alipay.branch || '未绑定' }} 
                    <span style="float:right;">
                        <template v-if="!alipay.branch">
                            <Button v-if="active != 'alipay'" size="large" type="primary" @click="active = 'alipay'">绑定</Button>
                            <Button v-if="active == 'alipay'" size="large" type="primary" @click="active = null">取消</Button>
                        </template>
                        <template v-if="alipay.branch">
                            <Button v-if="active != 'alipay'" size="large" type="text" @click="active = 'alipay'">修改</Button>
                            <Button v-if="active == 'alipay'" size="large" type="text" @click="active = null">取消</Button>
                            <Button size="large" type="text" @click="unbindTransferMode(2)">解绑</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'alipay' ">
                    <table>
                        <tr>
                            <td>姓名</td>
                            <td>{{realname}}</td>
                        </tr>
                        <tr>
                            <td>支付宝账号</td>
                            <td><Input v-model="alipay.branch" size="large" /></td>
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
                            <td align="center"><Button size="large" type="primary" @click="transferModeSet(2)"> 保存 </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
            <Row class="row" :class="active == 'wxpay'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-ai-weixin green" /> 微信支付</Col>
                <Col span="20" class="name"> {{ wxpay.branch || '未绑定' }} 
                    <span style="float:right;">
                        <template v-if="!wxpay.branch">
                            <Button v-if="active != 'wxpay'" size="large" type="primary" @click="active = 'wxpay'">绑定</Button>
                            <Button v-if="active == 'wxpay'" size="large" type="primary" @click="active = null">取消</Button>
                        </template>
                        <template v-if="wxpay.branch">
                            <Button v-if="active != 'wxpay'" size="large" type="text" @click="active = 'wxpay'">修改</Button>
                            <Button v-if="active == 'wxpay'" size="large" type="text" @click="active = null">取消</Button>
                            <Button size="large" type="text" @click="unbindTransferMode(3)">解绑</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'wxpay' ">
                    <table>
                        <tr>
                            <td>姓名</td>
                            <td><Input v-model="wxpay.real_name" size="large" /></td>
                        </tr>
                        <tr>
                            <td>微信账号</td>
                            <td><Input v-model="wxpay.branch" size="large" /></td>
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
                            <td align="center"><Button size="large" type="primary" @click="transferModeSet(3)"> 保存 </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
        </section>
        <Modal
            v-model="authModle"
            :closable = false
            :footer-hide = true
            :mask-closable = false
            class-name="vertical-center-modal">            
            <div>
                <h2>
                    必须先实名认证，去认证   
                </h2>
                <div style="text-align:right;">
                 <Button type="primary" size="large" style="font-size:16px" @click="$router.push(toUrl.financeUrl + '/nameAuth')"> OK </Button>
                </div>
            </div>
        </Modal>
    </section>
</template>

<script>
export default {
    data(){
        return{
            active:null,
            bank:{
                branch:''
            },
            alipay:{
                real_name:'',
                branch:''
            },
            wxpay:{
                real_name:'',
                branch:''
            },
            wxpayQR:{},
            alipayQR:{},
            realname:'',
            authModle:false,
            review:''
        }
    },

    mounted(){
        if(this.userBasicinfo.nameauthstatus == 1 && this.userBasicinfo.idcard){
            this.transferMode()
        }else{
            this.authModle = true
        }
    },
    methods:{
        transferMode(){
            this.axios({
                url : this.api.transferMode,
                data : {
                }
            }).then(res=>{
                if(res.data.bank){
                    this.bank = res.data.bank
                    this.realname = res.data.realname
                }
                if(res.data.alipay){
                    this.alipay = res.data.alipay
                    this.alipayQR.origin = res.data.alipay.account
                }
                if(res.data.wechat){
                    this.wxpay = res.data.wechat
                    this.wxpayQR.origin = res.data.wechat.account
                }
            }).catch( err=>{
                console.log(err)
            })
        },
        transferModeSet(type){
            if(type ==1){
                if(!this.bank.bank.trim() || !this.bank.branch.trim() || !this.bank.account.trim()){
                    this.$store.commit('msg/add', '填写项不能为空')
                    return
                }
                if(this.review.trim() != this.bank.account.trim()){
                    this.$store.commit('msg/add', '卡号二次输入不一致')
                    return
                }
                this.save(type)
            }
            if(type ==2){
                if(!this.alipay.branch.trim() || ! this.alipayQR.origin){
                    this.$store.commit('msg/add', '填写项不能为空')
                    return
                } 
                this.save(type)
            }
            if(type ==3){
                if(!this.wxpay.real_name.trim() || !this.wxpay.branch.trim() || !this.wxpayQR.origin){
                    this.$store.commit('msg/add', '填写项不能为空')
                    return
                } 
                this.save(type)
            }                      
        },
        save(type){
            let data = {}
            switch (type) {
                case 1:
                    data.name = this.realname
                    data.bank = this.bank.bank.trim()
                    data.branch = this.bank.branch.trim()
                    data.account = this.bank.account.trim()
                    break;
                case 2:
                    data.name = this.realname
                    data.branch = this.alipay.branch.trim()
                    data.account = this.alipayQR.origin
                    break;
                case 3:
                    data.name = this.wxpay.real_name.trim()
                    data.branch = this.wxpay.branch.trim()
                    data.account = this.wxpayQR.origin
                    break;            
                default:
                    break;
            }
            this.axios({
                url : this.api.transferModeSet,
                data : {
                    type,
                    ...data
                }
            }).then(res=>{
                this.active = null
                this.$store.commit('msg/add', res.message)
            }).catch( err=>{
                console.log(err)
            })  
        },

        unbindTransferMode(type){            
            this.axios({
                url : this.api.unbindTransferMode,
                data : {
                    type
                }
            }).then(res=>{
                this.active = null
                if(type==2){
                    this.alipay = {}
                    this.alipayQR = ''
                }
                if(type==3){
                    this.wxpay = {}
                    this.wxpayQR = ''
                }
                this.$store.commit('msg/add', res.message)
            }).catch( err=>{
                console.log(err)
            })
        },
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
