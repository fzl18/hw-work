<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].transferMode}}</span>
        </financeHeader>
        <div style="margin:10px 0">
            <span class="org">*</span> {{lang[local].transferModeTip1}}
        </div>
        <section class="card">
            <span class="flag">{{lang[local].transferModeTip2}}</span>
            <Row class="row" :class="active == 'bank'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-yinxingqia org" /> {{lang[local].bankCard}}</Col>
                <Col span="20" class="name"> {{ bank.bank ? `${bank.bank } (${lang[local].transferModeTip3}：${account2 ? account2.slice(-4):''})` : lang[local].accunbind }}  
                    <span style="float:right;">
                        <template v-if="!bank.branch">
                            <Button v-if="active != 'bank'" size="large" type="primary" @click="active = 'bank'">{{lang[local].accbtnbind}}</Button>
                            <Button v-if="active == 'bank'" size="large" type="primary" @click="handleCancel">{{lang[local].cancel}}</Button>
                        </template>
                        <template v-if="bank.branch">
                            <Button v-if="active != 'bank'"  size="large" type="text" @click="active = 'bank'">{{lang[local].accbtn}}</Button>
                            <Button v-if="active == 'bank'"  size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'bank' ">
                    <table>
                        <tr>
                            <td>{{lang[local].transferModeTip4}}</td>
                            <td>{{realname}}</td>
                        </tr>
                        <tr>
                            <td>{{lang[local].transferModeTip5}}</td>
                            <td><Input v-model="bank.bank" size="large" /></td>
                        </tr>
                        <tr>
                            <td>{{lang[local].transferModeTip6}}</td>
                            <td><Input v-model="bank.branch" size="large" /></td>
                        </tr>
                        <tr>
                            <td>{{lang[local].transferModeTip7}}</td>
                            <td class="ka"><input v-model="bank.account" size="large" /></td>
                        </tr>
                        <tr>
                            <td>{{lang[local].transferModeTip8}}</td>
                            <td class="ka"><input v-model="review" size="large" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary" @click="transferModeSet(1)"> {{lang[local].c2cSave}} </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
            <Row class="row" :class="active == 'alipay'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-ZFBZD blue" /> {{lang[local].aliPay}}</Col>
                <Col span="20" class="name"> {{ isBindAli ? alipay.branch : lang[local].accunbind }} 
                    <span style="float:right;">
                        <template v-if="!isBindAli">
                            <Button v-if="active != 'alipay'" size="large" type="primary" @click="active = 'alipay'">{{lang[local].accbtnbind}}</Button>
                            <Button v-if="active == 'alipay'" size="large" type="primary" @click="handleCancel">{{lang[local].cancel}}</Button>
                        </template>
                        <template v-if="isBindAli">
                            <Button v-if="active != 'alipay'" size="large" type="text" @click="active = 'alipay'">{{lang[local].accbtn}}</Button>
                            <Button v-if="active == 'alipay'" size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                            <Button v-if="active != 'alipay'" size="large" type="text" @click="unbindTransferMode(2)">{{lang[local].accbtnunbind}}</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'alipay' ">
                    <table>
                        <tr>
                            <td>{{lang[local].transferModeTip9}}</td>
                            <td>{{realname}}</td>
                        </tr>
                        <tr>
                            <td>{{lang[local].transferModeTip10}}</td>
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
                                    <div v-if="!alipayQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary" @click="transferModeSet(2)"> {{lang[local].c2cSave}} </Button></td>
                        </tr>
                    </table>
                </Col>
            </Row>
            <Row class="row" :class="active == 'wxpay'?'cur':''">
                <Col span="4" class="type"><i class="iconfont icon-ai-weixin green" /> {{lang[local].weChat}}</Col>
                <Col span="20" class="name"> {{ isBindWx ? wxpay.branch : lang[local].accunbind }} 
                    <span style="float:right;">
                        <template v-if="!isBindWx">
                            <Button v-if="active != 'wxpay'" size="large" type="primary" @click="active = 'wxpay'">{{lang[local].accbtnbind}}</Button>
                            <Button v-if="active == 'wxpay'" size="large" type="primary" @click="handleCancel">{{lang[local].cancel}}</Button>
                        </template>
                        <template v-if="isBindWx">
                            <Button v-if="active != 'wxpay'" size="large" type="text" @click="active = 'wxpay'">{{lang[local].accbtn}}</Button>
                            <Button v-if="active == 'wxpay'" size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                            <Button v-if="active != 'wxpay'" size="large" type="text" @click="unbindTransferMode(3)">{{lang[local].accbtnunbind}}</Button>
                        </template>
                    </span>
                </Col>
                <Col span="24" class="con" v-if=" active == 'wxpay' ">
                    <table>
                        <tr>
                            <td>{{lang[local].transferModeTip9}}</td>
                            <td><Input v-model="wxpay.real_name" size="large" /></td>
                        </tr>
                        <tr>
                            <td>{{lang[local].transferModeTip11}}</td>
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
                                    <div v-if="!wxpayQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center"><Button size="large" type="primary" @click="transferModeSet(3)"> {{lang[local].c2cSave}} </Button></td>
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
                    {{lang[local].transferModeTip13}}   
                </h2>
                <div style="text-align:right;">
                 <Button type="primary" size="large" style="font-size:16px" @click="go()"> Back </Button>
                </div>
            </div>
        </Modal>
    </section>
</template>

<script>
import {toUrl} from "../../../../common/api/api"
export default {
    data(){
        return{
            active:null,
            bank:{
                branch:'',
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
            review:'',
            isBindAli:false,
            isBindWx:false,
            account2:''
        }
    },
    watch:{
        "bank.account" (n,o){
            let numlength = 0
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.bank.account = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            console.log(this.bank.account.length)
            
            if(this.bank.account.length>19){
                this.bank.account = this.bank.account.substring(0,19)
            }
        },
        "review" (n,o){
            let numlength = 0
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.review = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
        }
    },
    mounted(){
        if(this.userBasicinfo.nameauthstatus == 1 && this.userBasicinfo.idcard){
            this.transferMode()
        }else if(this.userBasicinfo.nameauthstatus == 0){
            // this.transferMode()
            this.authModle = true
        }else{
            this.authModle = true
        }
    },
    methods:{
        go(){
            // location.href = toUrl.financeUrl + '/nameAuth'
            window.history.back()
        },
        transferMode(){
            this.axios({
                url : this.api.transferMode,
                data : {
                }
            }).then(res=>{
                this.realname = res.data.realname
                if(res.data.bank){
                    this.bank = res.data.bank
                    this.account2 = res.data.bank.account
                }
                if(res.data.alipay){
                    this.alipay = res.data.alipay
                    this.alipayQR.origin = res.data.alipay.account
                    this.isBindAli = true
                }
                if(res.data.wechat){
                    this.wxpay = res.data.wechat
                    this.wxpayQR.origin = res.data.wechat.account
                    this.isBindWx = true
                }
            }).catch( err=>{
                console.log(err)
            })
        },
        transferModeSet(type){
            if(type ==1){
                if(!this.bank.bank.trim() || !this.bank.branch.trim() || !this.bank.account.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(this.review.trim() != this.bank.account.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr2)
                    return
                }
                this.save(type)
            }
            if(type ==2){
                if(!this.alipay.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(!this.alipayQR.origin){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr3)
                    return
                }
                this.save(type)
            }
            if(type ==3){
                if(!this.wxpay.real_name.trim() || !this.wxpay.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(!this.wxpayQR.origin){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr3)
                    return
                }
                this.save(type)
            }                      
        },
        save(type){
            if(!this.userBasicinfo.nameauthstatus){
                this.$store.commit('msg/err', this.lang[this.local].transferModeErr4)
                return
            }
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
                this.transferMode()
                this.$store.commit('msg/add', res.message)
            }).catch( err=>{
                this.$store.commit('msg/err', err.message)
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
                    this.isBindAli = false
                }
                if(type==3){
                    this.wxpay = {}
                    this.wxpayQR = ''
                    this.isBindWx = false
                }
                this.transferMode()
                this.$store.commit('msg/add', res.message)
            }).catch( err=>{
                this.$store.commit('msg/err', err.message)
            })
        },
        handleCancel(){
            // this.bank.bank = ''
            // this.bank.branch = ''
            // this.bank.account = ''
            this.active = null
            // this.alipay = {}
            // this.alipayQR = ''
            // this.wxpay = {}
            // this.wxpayQR = ''
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
    .ka{
        input{
            border-radius:4px;
            border:1px solid #dddee1;
            line-height:32px;
            padding:0 10px;
            transition:all .3s;
            width:100%;
            &:focus, &:hover{
                border:1px solid #FF6600;
            }
        }
        span{
            border-radius:4px;
            border:1px solid #dddee1;
            border-left: none;
            line-height:32px;
            display: inline-block;
            padding:0 10px;
            background: #eee;
        }
    }
    .iconfont{font-size:26px;font-weight:normal;margin-right:10px;position: relative;top:3px;}
</style>
