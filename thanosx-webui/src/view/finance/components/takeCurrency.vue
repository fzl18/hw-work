<template>
    <section>
        <financeHeader>
            <span>{{lang[local].withdrawCash}}</span>
        </financeHeader>
        
        <section class="finance-coin" style="background:none">

            <!-- <balance v-model="balance" :coin="coin" /> -->
            <section class="takeCoin">
                <section class="takeCoin-form finance-form">
                    <section class="form-group">                        
                        <span style="padding-left:10px;font-size:16px;"> {{lang[local].taketxt1}}：{{coinInfo.asset}} {{coin}}</span> 
                    </section>
                    <section class="form-group">
                        <div class="input-box">
                            <span style="font-size:16px;padding-left:10px;">{{lang[local].taketip3}}:</span>
                            <Select id="bankcard" size="large" v-model="card" :placeholder="lang[local].gu_finance100 +lang[local].bankCard">
                                <Option v-for="item in payList" :value="item.id" :key="item.id">{{ item.bank }} ({{ lang[local].tailNum +":" + item.account.slice(-4) }})</Option>
                            </Select>                         
                        </div>                        
                    </section>
                    <section class="form-group">
                        <div class="input-box">
                            <span style="font-size:16px;padding-left:10px;">{{lang[local].num}}:</span><input name="takeCoin-num" type="text"  v-model="num" :placeholder="lang[local].taketip1" />
                        </div>
                    </section>
                    <section class="form-group">                        
                        <span style="padding-left:10px;font-size:16px;"> {{lang[local].myDeal_ServiceCharge}}：{{fee}} {{coinInfo.currency}}</span> 
                    </section>
                    <section class="form-group">                        
                        <span style="padding-left:10px;font-size:16px;"> {{lang[local].taketip2}}：{{getMoney}} {{coinInfo.currency}}</span> 
                    </section>
                    <section class="form-group">
                        <div class="input-box">
                        <span style="font-size:16px;padding-left:10px;">{{lang[local].payPassword}}:</span><input name="takeCoin-password" type="password" v-model="paypassword" :placeholder="lang[local].payPassword" />
                        </div>
                    </section>
                    <section class="form-group">
                        <div class="input-box">
                        <span style="font-size:16px;padding-left:10px;">{{lang[local].verifCode}}:</span><input type="text" v-model="moble_verify" :placeholder="lang[local].verifCode" style="width:70%" />
                        <span @click="sendVerify" class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
                        {{
                            verifyCodeTimeText == -1
                            ? lang[local].getVerifCode + '...'
                            : verifyCodeTimeText
                            ? verifyCodeTimeText
                            : lang[local].getVerifCode
                        }}
                        </span>
                        </div>
                    </section>                    
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="submit" class="form-submit-btn" style="width:100%;font-size:18px;">{{lang[local].withdrawCash}}</a>
                    </section>
                </section>
                <section class="takeCoin-text">
                    <h4>{{lang[local].taketxt2}}</h4>
                    <p>{{lang[local].taketxt3}}</p>
                    <p>{{taketxt4}}</p>
                    <p>{{taketxt5}}</p>
                    <p>{{lang[local].taketxt6}}</p>
                    <p>{{lang[local].taketxt7}}</p>
                </section>
            </section>
        </section>

        <h4 class="finance-title">
            <span>{{lang[local].withdrawCash}}{{lang[local].history}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.withdrawList" :param="routeParam" :updata="upList">
            <dl slot="head">
                <dd style="width:25%">{{lang[local].takeCoinTime}}</dd>
                <dd style="width:25%">{{lang[local].taketip3}}</dd>
                <dd style="width:15%">{{lang[local].takeCoinNum}}</dd>
                <dd style="width:10%">{{lang[local].c2cTit2}}</dd>
                <dd style="width:15%">{{lang[local].taketxt8}}</dd>
                <dd style="width:10%">{{lang[local].takeCoinState}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}" :key="item.id">
                <dd style="width:25%">{{localDate(item.create_at)}}</dd>
                <dd style="width:25%"><span>{{item.sn}}</span></dd>
                <dd style="width:15%"><span>{{item.amount}}</span></dd>
                <dd style="width:10%">{{item.fee}}</dd>
                <dd style="width:15%"><span>{{item.actual_amount}}</span></dd>
                <dd style="width:10%"><span class="buy">{{item.status == "1" ? lang[local].takeCoinstatus1 : item.status=='2' ? lang[local].taketxt10 : item.status=='3' ?lang[local].orderState2 :''}}</span></span></dd>
            </dl>
        </list>
        <Modal
            v-model="boxModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal applyBiz" >
            <h1>{{lang[local].confirm}}{{lang[local].withdrawCash}}</h1>
            <table>
                <tr>
                    <td colspan="2">
                        <p>{{lang[local].taketip1}}</p>
                        <p><b>{{num}} {{coin}}</b></p>
                    </td>
                </tr>
                <tr>
                    <td width="70%">
                        <p>{{lang[local].taketip2}}</p>
                        <p><b class="org">{{getMoney}} {{coinInfo.currency}}</b> </p>
                    </td>
                    <td>
                        <p>{{lang[local].c2cTit2}}</p>
                        <p><b class="buy">{{fee}} {{coinInfo.currency}}</b> </p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <p>{{lang[local].taketip3}}</p>
                        <p><b>{{bankInfo.bank_account_number}}</b></p>
                        <p><b>{{bankInfo.bank_account_name}} {{bankInfo.bank_name}}</b></p>
                    </td>
                </tr>
                <tr v-if="userBasicinfo.gabind">
                    <td colspan="2">
                        <p>{{lang[local][4009]}}：<Input name="ga" type="text" style="width:70%" v-model="ga" :placeholder="lang[local].c2cIput" /></p>                           
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <p>{{lang[local].taketip4}}{{lang[local].taketip5}}</p>
                    </td>
                </tr>                
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">                            
                            <Col span="12"><Button type="primary" size="large" @click="withdrawConfirm">{{lang[local].apply36}}</Button></Col>
                            <Col span="12" style="text-align:right"><Button type="text" size="large" style="padding-right:0" @click="boxModal=false">{{lang[local].c2cClose}}</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
    </section>
</template>

<script>
import bigNumber from "bignumber.js"
    export default {
        name: "take-coin",
        data (){
            return {
                coin : '',
                num : '',
                card:'',
                paypassword : '',
                moble_verify : '',
                balance : {},
                sendCodeCount : 0,
                payList : [],
                coinInfo:{},
                selectedWallet : {},
                upList : 1,
                boxModal:false,
                historyList:[],
                uid:null,
                bankInfo:{},
                ga:'',
            }
        },
        computed : {
            routeParam (){
                return {
                    coin : this.lowerCase(this.coin),
                    upList : this.upList
                };
            },
            fee(){
                return Math.round((this.num * 1 || 0 ) * this.coinInfo.withdraw_fee)
            },
            getMoney(){
                return Math.floor( (this.num - this.fee)*100 ) / 100
            },
            taketxt4(){
                return this.lang[this.local].taketxt4.replace('{fee}',this.coinInfo.withdraw_fee*100)
            },
            taketxt5(){
                return this.lang[this.local].taketxt5.replace('{min}',this.coinInfo.withdraw_min_amount)
            },
            takeerr1(){
                return this.lang[this.local].takeerr1.replace('{min}',this.coinInfo.withdraw_min_amount)
            },
            takeerr2(){
                return this.lang[this.local].takeerr2.replace('{max}',this.coinInfo.withdraw_max_amount)
            }
        },
        watch : {
            balance (n, o){
                if(n.state == 2){
                    this.$router.push('./index');
                };
            },
            num (n, o){
                let numlength = 0
                let v = ''
                for(let k=0;k<numlength;k++){
                    v += '\\d'
                }
                let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
                this.num = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
                this.num = Math.floor(this.num)
                if(this.coinInfo.asset || this.coinInfo.asset == 0){                    
                    // if(this.num > this.coinInfo.withdraw_max_amount*1){
                    //     this.num = this.coinInfo.withdraw_max_amount*1
                    // }
                    // if(this.num < this.coinInfo.withdraw_min_amount*1){
                    //     this.num = this.coinInfo.withdraw_min_amount*1
                    // }
                    if(this.num > this.coinInfo.asset){
                        this.num = this.coinInfo.asset
                    }
                }
                
                // n = (n + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".")
                // this.num = n || ''
            },
            coin (n, o){
            },
        },
        created (){
            this.coinChange();
            this.getpayList();
        },
        beforeRouteUpdate (to, from ,next){
            next();
            this.coinChange()
        },
        methods : {
            submit (){
                if(this.getState == this.getStateStart){
                    return false;
                };

                var {coin, num, card,paypassword, moble_verify, sendCodeCount} = this;

                if(!num){
                    this.$store.commit('msg/err', this.lang[this.local].takeCoinNumEmpty);
                    return false;
                }
                if(num*1 < this.coinInfo.withdraw_min_amount *1){
                    this.$store.commit('msg/err', this.takeerr1);
                    return false;
                }
                if(num*1 > this.coinInfo.withdraw_max_amount *1){
                    this.$store.commit('msg/err', this.takeerr2);
                    return false;
                }
                if(!card){
                    this.$store.commit('msg/err', this.lang[this.local].gu_finance100 + this.lang[this.local].transferModeTip7);
                    return false;
                }
                if(!paypassword){
                    this.$store.commit('msg/err', this.lang[this.local].payPasswordNoEmpty);
                    return false;
                };
                if(sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].sendVerifCode);
                    return false;
                };

                if(moble_verify.length != 6){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode);
                    return false;
                };
                this.axios({
                    url : this.api.withdrawSubmit,
                    data : {
                        coin : this.lowerCase(coin),
                        pay_id:this.card,
                        amount:this.num,
                        pay_password:this.paypassword,
                        email_verify:this.moble_verify
                    },
                }).then((res) => {                    
                    this.boxModal = true
                    this.uid = res.data.id
                    this.withdrawPreview()
                }).catch((err) => {                    
                    this.getError();
                    this.$store.commit('msg/err', err.message)
                });
            },

            getpayList (){
                this.axios({
                    url : this.api.withdrawInfo,
                    data:{
                        coin : this.lowerCase(this.coin),
                    }
                }).then((res) => {
                    var data = res.data
                    this.payList = data.bank_list
                    this.coinInfo = data.coin_info
                }).catch((err) => {
                    if(err.code == 84001){
                        this.$store.commit('msg/err', err.message)
                        this.$router.push('/nameAuth')
                    }
                    if(err.code == 20046){
                        this.$store.commit('msg/err', err.message)
                        this.$router.push('/account')
                    }
                    if(err.code == 20018){
                        this.$store.commit('msg/err', err.message)
                        this.$router.push('/setTradePassword')
                    }
                    if(err.code == 84301){
                        this.$store.commit('msg/err', err.message)
                        this.$router.push('/transferMode')
                    }
                    this.$store.commit('msg/err', err.message)
                });
            },
            
            withdrawList (){
                this.axios({
                    url : this.api.withdrawList,
                    data:{
                        coin : this.lowerCase(this.coin),
                    }
                }).then((res) => {
                    var data = res.data
                    this.historyList = data.list
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.sendCaptcha,
                    data:{
                        type:"10"
                    }                 
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown()
                    this.$store.commit('msg/add', this.lang[this.local].emailTips);
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                    this.$store.commit('msg/err', err.message || this.lang[this.local].sendVerifCodeError);
                });
            },
            withdrawPreview (){
                this.axios({
                    url : this.api.withdrawPreview,
                    data:{
                        id : this.uid,
                    }
                }).then((res) => {
                    this.bankInfo = res.data
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                });
            },

            withdrawConfirm (){
                if(this.userBasicinfo.gabind && !this.ga){
                    this.$store.commit('msg/err', this.lang[this.local].ga1)
                    return false
                }
                this.axios({
                    url : this.api.withdrawConfirm,
                    data:{
                        id : this.uid,
                        ga_code:this.ga,
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', res.message)
                    this.boxModal = false
                    this.getSuccess();
                    this.num = ''
                    this.moble_verify = ''
                    this.sendCodeCount = 0
                    this.paypassword = ''
                    this.verifyCodeTimeText = ''
                    this.upList++
                    this.getpayList()
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                });
            },
            
        }
    }
</script>

<style scoped lang="scss">
    .userinfo{
        margin-bottom:30px;
        background: #F1F1F1;padding:15px;font-size:16px;
        span{color:#FF6500;font-size:20px;font-weight:bold}
    }
    .applyBiz{
        color:#999;
        table{
            margin-top:20px;
            font-size:16px;
            width: 100%;
            tr:nth-child(5){color:#777;}  
            td{
                padding:8px 0;
                line-height: 50px;
                p{line-height: 26px;}
                
            }
        }
    }
    .takeCoin-text{
        p{font-size:15px;}
    }
    #bankcard{
        width:70%;
        .ivu-select-selection{
            border:none!important;
            .ivu-select-selected-value, .ivu-select-placeholder{font-size:16px!important;}           
        }
        .ivu-select-item{font-size:16px!important;}
    }
    .ivu-select-single .ivu-select-selection .ivu-select-selected-value{font-size:16px!important;}
    
</style>
