<template>
    <section>
        <financeHeader>
            <span>{{lang[local].recharge}}</span>
        </financeHeader>
        <section class="finance-coin" style="background:none">
            <balance v-model="balance" :coin="coin" />
            <section class="pushCoin finance-form">
                <div class="" style="margin-right:10%;width:40%;float:left;">
                    <section class="form-group">
                        <div>{{lang[local].c2cCoin}}：{{coin}}</div>
                        <div class="input-box">
                            {{lang[local].num}}：<input style="width:80%;border:none;box-shadow:none;"  name="takeCoin-num" type="text"  v-model="num" :placeholder="coin + lang[local].pushtxt9 + coin_info.recharge_min_amount" />
                        </div>
                        <div>{{lang[local].pushtxt1}}：{{num || '--'}} {{coin_info.currency}}</div>
                    </section>
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="rechargeCode" class="form-submit-btn" style="width:100%;margin-top:60px;">{{lang[local].recharge}}</a>
                    </section>
                </div>
                <div style="width:45%;float:left">
                    <div class="org" style="font-size:16px;">{{lang[local].pushtxt2}}</div>
                    <div class="tip">
                        <p>{{lang[local].pushtxt3}}</p>
                        <p>{{lang[local].pushtxt4}}</p>
                        <p v-html="lang[local].pushtxt5"></p>
                        <p style="color:#777;line-height:30px">
                            {{lang[local].takebank1}}<b>{{account_info.bank}}</b><br />
                            {{lang[local].takebank2}}<b>{{account_info.instituion}}</b><br />
                            {{lang[local].takebank3}}<b>{{account_info.transit}}</b><br />
                            {{lang[local].takebank4}}<b>{{account_info.account}}</b><br />
                            {{lang[local].takebank5}}<b>{{account_info.swiftcode}}</b>
                        </p>
                        <p v-html="lang[local].pushtxt6"></p>
                        <p v-html="lang[local].pushtxt7"></p>
                        <p v-html="lang[local].pushtxt8"></p>
                    </div>

                </div>
            </section>
            <section class="pushCoin" >
                
            </section>
        </section>

        <h4 class="finance-title">
            <span>{{lang[local].recharge}}{{lang[local].history}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.rechargeList" :param="routeParam" :updata="updata">
            <dl slot="head">
                <dd style="width:22%">{{lang[local].pushCoinTime}}</dd>
                <dd style="width:10%">{{lang[local].c2cCoin}}</dd>
                <dd style="width:10%">{{lang[local].pushCoinNum}}</dd>
                <dd style="width:15%">{{lang[local].pushtip2}}</dd>
                <dd style="width:20%">{{lang[local].c2cOrderNO}}</dd>
                <dd style="width:23%">{{lang[local].pushCoinState}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd style="width:22%">{{localDate(item.create_at)}}</dd>
                <dd style="width:10%"><span class="line-feed">{{item.coin.toUpperCase()}}</span></dd>
                <dd style="width:10%"><span class="line-feed">{{item.amount}}</span></dd>
                <dd style="width:15%" class="org">{{item.code}}</dd>
                <dd style="width:20%"><span>{{item.sn}}</span></dd>
                <dd style="width:23%">
                    <Poptip
                        placement="left"
                        class="poptip"
                        confirm
                        :title = "lang[local].pushtxt12"
                        :ok-text="lang[local].submit"
                        :cancel-text="lang[local].cancel"
                        @on-ok="rechargeConfirm(item.id)"
                        @on-cancel="cancel">
                        <a href="javascript:;"> {{item.status == "0" ? lang[local].c2cTit5 :''}}</a>
                    </Poptip>
                    <span class="buy" :style="item.status == '0' ? 'margin-left:8px;padding-left:12px;border-left:1px solid #ccc;font-size:13px':''">{{item.status == "0" ? lang[local].taketxt11:item.status == '1' ? lang[local].takeCoinstatus1 : item.status=='2' ? lang[local].pushtxt10 : item.status=='3' ?lang[local].pushtxt11 :''}}</span></dd>
            </dl>
        </list>
        <Modal
            v-model="boxModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal applyBiz" >
            <h1>{{lang[local].apply36}}{{lang[local].recharge}}</h1>
            <p class="tip">{{pushtip1}}</p>
            <table>
                <tr>
                    <td>
                        <p>{{lang[local].takebank1}}<b>{{account_info.bank}}</b></p>
                        <p>{{lang[local].takebank2}}<b>{{account_info.instituion}}</b></p>
                        <p>{{lang[local].takebank3}}<b>{{account_info.transit}}</b></p>
                        <p>{{lang[local].takebank4}}<b>{{account_info.account}}</b></p>
                        <p>{{lang[local].takebank5}}<b>{{account_info.swiftcode}}</b></p>
                        <p><b>{{lang[local].pushtip2}}：</b><b class="sell">{{code}}</b></p>
                    </td>
                </tr>
                <tr>
                    <td class="block">
                        <p v-html="lang[local].pushtip3"></p>
                        <p v-html="lang[local].pushtip4"></p>
                        <p v-html="lang[local].pushtip5"></p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">                            
                            <Col span="12" style="text-align:left"><Button type="primary" size="large" @click="rechargeSubmit">{{lang[local].confirm}}</Button></Col>
                            <Col span="12" style="text-align:right"><Button type="text" size="large" @click="boxModal=false">{{lang[local].c2cClose}}</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
    </section>
</template>

<script>
    export default {
        name: "push-coin",
        data (){
            return {
                coin : '',
                balance : {},
                boxModal:false,
                coin_info:{},
                account_info:{},
                num:null,
                code:null,
                list:[],
                updata:0
            };
        },
        computed : {
            routeParam (){
                return {
                    coin : this.lowerCase(this.coin)
                };
            },
            pushtip1(){
                return this.lang[this.local].pushtip1.replace('{coin}',this.coin)
            },
            pusherr1(){
                return this.lang[this.local].pusherr1.replace('{min}',this.coin_info.recharge_min_amount)
            },
            pusherr2(){
                return this.lang[this.local].pusherr2.replace('{max}',this.coin_info.recharge_max_amount)
            },
            fee(){
                return this.num * this.coin_info.recharge_fee
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

                // if(this.num > this.coin_info.recharge_max_amount *1){
                //     this.num = this.coin_info.recharge_max_amount *1
                // }
            },
        },
        created (){
            this.coinChange();
            this.rechargeInfo();
        },
        beforeRouteUpdate (to, from ,next){
            next();
            this.coinChange();
        },
        methods : {
            rechargeInfo (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.rechargeInfo,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.coin_info = res.data.coin_info
                    this.account_info = res.data.account_info
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
                    this.getError()
                });
            },
            rechargeCode (){
                if(!this.num){
                    this.$store.commit('msg/err', this.lang[this.local].addOrderErr2)
                    return false
                }
                if(this.num *1 < this.coin_info.recharge_min_amount *1){
                    this.$store.commit('msg/err', this.pusherr1)
                    return false
                }
                if(this.num *1 > this.coin_info.recharge_max_amount *1){
                    this.$store.commit('msg/err', this.pusherr2)
                    return false
                }
                this.boxModal=true
                this.axios({
                    url : this.api.rechargeCode,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.code = res.data.code;
                    // this.myaddrstatus();
                }).catch((err) => {
                    this.getError();
                    this.code = null;
                    this.$store.commit('msg/err', this.lang[this.local].pushCoinError);
                });
            },
            rechargeSubmit (){       
                this.axios({
                    url : this.api.rechargeSubmit,
                    data : {
                        coin : this.lowerCase(this.coin),
                        amount:this.num,
                        code:this.code
                    },
                }).then((res) => {
                    this.$store.commit('msg/add', res.message)
                    this.boxModal=false
                    this.updata++
                    this.num=null
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                    this.boxModal=false
                });
            },

            rechargeList (){
                this.axios({
                    url : this.api.rechargeList,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.list = res.data.list
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].walletActiveE);
                });
            },
            rechargeConfirm(id){
                this.axios({
                    url:this.api.rechargeConfirm,
                    data:{
                        id
                    }
                }).then(res=>{
                    this.updata++
                    this.$store.commit('msg/add', res.message)
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                });
            },
            cancel(){

            }
        }
    }
</script>

<style lang="scss" scoped>
.applyBiz{
    color:#999;
    .tip{
        font-size:16px;
        margin:20px 0 10px 0;
    }
    table{
        font-size:15px;
        width: 100%;
        tr:last-child{text-align: center;}  
        td{
            line-height: 40px;
            p{line-height: 26px;}
            &.block{
                color:#777;
                padding-top:20px;
            }
        }
    }
}
.form-group{
    font-size: 16px;
    .input-box{
        margin:30px 0 40px 0
    }
    
}
.tip{
    margin-top:20px;
    p{margin:12px 0;line-height:24px;}
}

</style>
