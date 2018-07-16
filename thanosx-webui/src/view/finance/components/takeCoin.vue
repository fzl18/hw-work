<template>
    <section>
        <financeHeader>
            <span>{{lang.safetyTakeCoin}}</span>
        </financeHeader>
        <section class="finance-coin">
            <balance v-model="balance" :coin="coin" />
            <section class="takeCoin ban" v-if="balance.state == 1 && balance.zc_jz != 1">
                {{upperCase(coin)}} {{lang.takeCoinBan}}
            </section>
            <section class="takeCoin" v-if="balance.state == 1 && balance.zc_jz == 1">
                <section class="takeCoin-form finance-form">
                    <section class="form-group">
                        <label>{{lang.selectWallet}}</label>
                        <select-my class="safety-issue-select" v-model="addr" :list="walletList" selected="" @change="walletChange" />
                        <!--<router-link class="take-coin-wallet" :class="classActive(walletList.length > 1)" to="/addWallet">
                            {{lang.addWallet}}
                        </router-link>-->
                    </section>
                    <section class="form-group" v-if="addr && selectedWallet.addr">
                        <label>{{lang.walletUrl}}</label>
                        <section class="text">
                            <span style="display: inline-block;line-height: 1.4;vertical-align: middle;">{{selectedWallet.addr}}</span>
                        </section>
                    </section>
                    <section class="form-group">
                        <label>{{lang.takeCoinNum}}</label>
                        <input @keyup.enter="upmyzc" name="takeCoin-num" type="text" @blur="num > balance.xnb ? num = balance.xnb : num < balance.minZc ?num = balance.minZc : ''" v-model="num" :placeholder="lang.takeCoinNum" />
                    </section>
                    <section class="form-group">
                        <label>{{lang.payPassword}}</label>
                        <input @keyup.enter="upmyzc" name="takeCoin-password" type="password" v-model="paypassword" :placeholder="lang.payPassword" />
                    </section>
                    <section class="form-group">
                        <label>{{lang.verifCode}}</label>
                        <input @keyup.enter="upmyzc" type="text" v-model="moble_verify" :placeholder="lang.SMSVerifCode" />
                        <span @click="sendVerify" class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
                        {{
                            verifyCodeTimeText == -1
                            ? lang.getVerifCode + '...'
                            : verifyCodeTimeText
                            ? verifyCodeTimeText
                            : lang.getVerifCode
                        }}
                        </span>
                    </section>
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="upmyzc" class="form-submit-btn">{{lang.takeCoin}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    </section>
                </section>
                <section class="takeCoin-text">
                    <h4>{{lang.takeCoinExplain1}}</h4>
                    <p>{{lang.takeCoinExplain2}}</p>
                    <p>{{lang.takeCoinExplain3}}</p>
                    <p>{{lang.takeCoinExplain4}}{{balance.fee || 0}}{{lang.takeCoinExplain5}}{{coin}}。</p>
                    <p>{{lang.takeCoinExplain6}}{{balance.minZc || 0}}{{lang.takeCoinExplain5}}{{coin}}，{{lang.takeCoinExplain7}}{{balance.maxZc || 0}}{{lang.takeCoinExplain5}}{{coin}}。</p>
                </section>
            </section>
        </section>

        <h4 class="finance-title">
            <span>{{lang.takeCoinRecord}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.myzcLog" :param="routeParam" >
            <dl slot="head">
                <dd>{{lang.takeCoinTime}}</dd>
                <dd>{{lang.takeCoinId}}</dd>
                <dd>{{lang.takeCoinURL}}</dd>
                <dd>{{lang.takeCoinNum}}</dd>
                <dd>{{lang.takeCoinState}}</dd>
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
                    this.$store.commit('msg/err', this.lang.walletNoEmpty);
                    return false;
                };
                if(!num){
                    this.$store.commit('msg/err', this.lang.takeCoinNumEmpty);
                    return false;
                };
                if(Number.parseFloat(this.balance.xnb) < (this.balance.minZc * 1 + this.balance.fee * 1)){
                    this.$store.commit('msg/err', this.lang.takeCoinNumEmpty2);
                    return false;
                };
                if(num * 1 < this.balance.minZc  * 1){
                    this.$store.commit('msg/err', this.lang.takeCoinNumMin);
                    return false;
                };
                if(num * 1 > this.balance.maxZc  * 1){
                    this.$store.commit('msg/err', this.lang.takeCoinNumMax);
                    return false;
                };
                if(!paypassword){
                    this.$store.commit('msg/err', this.lang.payPasswordNoEmpty);
                    return false;
                };
                if(sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang.sendVerifCode);
                    return false;
                };
                if(moble_verify.length != 6){
                    this.$store.commit('msg/err', this.lang.enterVerifCode);
                    return false;
                };

                this.getStart();
                this.axios({
                    url : this.api.upmyzc,
                    data : {
                        coin : this.lowerCase(coin),
                        addr, num, paypassword, moble_verify, sendCodeCount
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.takeCoinSuccess);
                    // this.$router.push('./index');
                    this.num = '';
                    this.moble_verify = '';
                    this.sendCodeCount = 0;
                    this.paypassword = '';
                    this.verifyCodeTimeText = '';
                    this.upList = this.upList + 1;
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.takeCoinError);
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
                    var walletList = [['', this.lang.goAddWallet]];
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
                    // this.$store.commit('msg/del', this.lang.walletNoEmpty);
                    this.selectedWallet = val[2] || {};
                }else{
                    this.$router.push('/addWallet');
                    // this.$store.commit('msg/err', this.lang.walletNoEmpty);
                };
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.takeCoinVerify,
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                    this.$store.commit('msg/err', err.message || this.lang.sendVerifCodeError);
                });
            },
        }
    }
</script>

