<template>
    <section>
        <financeHeader>
            <span>{{lang[local].safetyTakeCoin}}</span>
        </financeHeader>
        
        <section class="finance-coin" style="background:none">
            <div class="userinfo">
                {{lang[local].usable}}：<span>{{numDecimals(balance.xnb)}}</span> 
            </div>
            <balance v-model="balance" :coin="coin" />
            <section class="takeCoin ban" v-if="balance.state == 1 && balance.zc_jz != 1">
                {{upperCase(coin)}} {{lang[local].takeCoinBan}}
            </section>
            <section class="takeCoin"  v-if="balance.state == 1 && balance.zc_jz == 1">
                <section class="takeCoin-form finance-form">
                    <section class="form-group">
                        <!-- <label>{{lang[local].selectWallet}}</label> -->
                        <!-- <router-link class="take-coin-wallet" :class="classActive(walletList.length > 1)" to="/addWallet">
                            {{lang[local].addWallet}}
                        </router-link> -->
                        <div class="input-box">
                            <select-my class="safety-issue-select" v-model="addr" :list="walletList" selected="" @change="walletChange" :placeholder="lang[local].selectWallet"/>                            
                        </div>                        
                    </section>
                    <section class="form-group" v-if="addr && selectedWallet.addr">
                        <!-- <label>{{lang[local].walletUrl}}</label> -->
                        <section class="text">
                            <div class="input-box">
                            {{lang[local].walletUrl}}  <span style="display: inline-block;line-height: 1.4;vertical-align: middle;">{{selectedWallet.addr}}</span>
                            </div>
                        </section>
                    </section>
                    <section class="form-group">
                        <div class="input-box">
                            <input @keyup.enter="upmyzc" name="takeCoin-num" type="text" @blur="num > balance.xnb ? num = balance.xnb : num < balance.minZc ?num = balance.minZc : ''" v-model="num" :placeholder="lang[local].takeCoinNum" />
                        </div>
                    </section>
                    <section class="form-group">                        
                        <span style="padding-left:10px;font-size:16px;color:#999;"> {{lang[local].myDeal_ServiceCharge}}：{{balance.fee}} {{coin}}</span> 
                    </section>
                    <section class="form-group">
                        <!-- <label>{{lang[local].payPassword}}</label> -->
                        <div class="input-box">
                        <input @keyup.enter="upmyzc" name="takeCoin-password" type="password" v-model="paypassword" :placeholder="lang[local].payPassword" />
                        </div>
                    </section>
                    <section class="form-group">
                        <!-- <label>{{lang[local].verifCode}}</label> -->
                        <div class="input-box">
                        <input @keyup.enter="upmyzc" type="text" v-model="moble_verify" :placeholder="lang[local].verifCode" style="width:70%" />
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
                        <a href="javascript:;" @click="upmyzc" class="form-submit-btn">{{lang[local].takeCoin}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    </section>
                </section>
                <section class="takeCoin-text">
                    <h4>{{lang[local].takeCoinExplain1}}</h4>
                    <p>{{lang[local].takeCoinExplain2}}</p>
                    <p>{{lang[local].takeCoinExplain3}}</p>
                    <p>{{lang[local].takeCoinExplain4}}{{balance.fee || 0}}{{coin}}</p>
                    <p>{{lang[local].takeCoinExplain6}}{{balance.minZc || 0}}{{lang[local].takeCoinExplain5}}{{coin}}，{{lang[local].takeCoinExplain7}}{{balance.maxZc || 0}}{{lang[local].takeCoinExplain5}}{{coin}}。</p>
                </section>
            </section>
        </section>

        <h4 class="finance-title">
            <span>{{lang[local].takeCoinRecord}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.myzcLog" :param="routeParam" >
            <dl slot="head">
                <dd>{{lang[local].takeCoinTime}}</dd>
                <dd>{{lang[local].takeCoinId}}</dd>
                <dd>{{lang[local].takeCoinURL}}</dd>
                <dd>{{lang[local].takeCoinNum}}</dd>
                <dd>{{lang[local].takeCoinState}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}" :key="item.id">
                <dd>{{localDate(item.addtime)}}</dd>
                <dd><span class="line-feed">{{item.txid}}</span></dd>
                <dd><span class="line-feed">{{item.to}}</span></dd>
                <dd>{{item.num}}</dd>
                <dd><span class="mainColor">{{item.state}}</span></dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "take-coin",
        data (){
            return {
                coin : '',
                addr : '',
                num : '',
                paypassword : '',
                moble_verify : '',
                balance : {},
                sendCodeCount : 0,
                walletList : [],
                selectedWallet : {},
                upList : 1
            }
        },
        computed : {
            routeParam (){
                return {
                    coin : this.lowerCase(this.coin),
                    upList : this.upList
                };
            },
        },
        watch : {
            balance (n, o){
                if(n.state == 2){
                    this.$router.push('./index');
                };
            },
            num (n, o){
                n = (n + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".");
                this.num = n || '';
                // this.num = n > this.balance.xnb ? this.balance.xnb : n < this.balance.minZc ? this.balance.minZc :n;
            },
            coin (n, o){
            },
        },
        created (){
            this.coinChange();
            this.getWalletList();
        },
        beforeRouteUpdate (to, from ,next){
            next();
            this.coinChange();
            this.getWalletList();
        },
        methods : {
            upmyzc (){

                if(this.getState == this.getStateStart){
                    return false;
                };

                var {coin, addr, num, paypassword, moble_verify, sendCodeCount} = this;
                if(!addr){
                    this.$store.commit('msg/err', this.lang[this.local].walletNoEmpty);
                    return false;
                };
                if(!num){
                    this.$store.commit('msg/err', this.lang[this.local].takeCoinNumEmpty);
                    return false;
                };
                if(Number.parseFloat(this.balance.xnb) < (this.balance.minZc * 1 + this.balance.fee * 1)){
                    this.$store.commit('msg/err', this.lang[this.local].takeCoinNumEmpty2);
                    return false;
                };
                if(num * 1 < this.balance.minZc  * 1){
                    this.$store.commit('msg/err', this.lang[this.local].takeCoinNumMin);
                    return false;
                };
                if(num * 1 > this.balance.maxZc  * 1){
                    this.$store.commit('msg/err', this.lang[this.local].takeCoinNumMax);
                    return false;
                };
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

                this.getStart();
                this.axios({
                    url : this.api.upmyzc,
                    data : {
                        coin : this.lowerCase(coin),
                        addr, num, paypassword, email_verify:moble_verify, sendCodeCount
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].takeCoinSuccess);
                    // this.$router.push('./index');
                    this.num = '';
                    this.moble_verify = '';
                    this.sendCodeCount = 0;
                    this.paypassword = '';
                    this.verifyCodeTimeText = '';
                    this.upList = this.upList + 1;
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].takeCoinError);
                });
            },
            getWalletList (){
                this.axios({
                    url : this.api.userQianbaoList,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    var data = (Array.isArray(res.data) && res.data) || [];
                    var walletList = [['', this.lang[this.local].goAddWallet]];
                    data.forEach((q) => {
                        walletList.push([q.id, q.name, q]);
                    });
                    this.walletList = walletList;
                }).catch((err) => {
                    console.log(err);
                });
            },
            walletChange (val){
                if(val[0]){
                    // this.$store.commit('msg/del', this.lang[this.local].walletNoEmpty);
                    this.selectedWallet = val[2] || {};
                }else{
                    this.$router.push('/addWallet');
                    // this.$store.commit('msg/err', this.lang[this.local].walletNoEmpty);
                };
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.withdrawVerifyCode,                    
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                    this.$store.commit('msg/err', err.message || this.lang[this.local].sendVerifCodeError);
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
</style>
