<template>
    <section>
        <financeHeader>
            <span>{{lang[local].pushCoinSafety}}</span>
        </financeHeader>
        <section class="finance-coin">
            <balance v-model="balance" :coin="coin" />
            <section class="takeCoin ban" v-if="balance.state == 1 && balance.zr_jz != 1">
                {{upperCase(coin)}} {{lang[local].pushCoinBan}}
            </section>
            <section class="pushCoin" v-if="balance.state == 1 && balance.zr_jz == 1 && walletData && walletData.address">
            <!--<section class="pushCoin">-->
                <!-- <section class="pushCoin-ewm" v-if="!(walletData && walletData.title_key)"> -->
                <section class="pushCoin-ewm" style="margin-right:20px;">
                    <div>
                        <ewm :value="(walletData && walletData.address) || ''" :size="180" />
                    </div>
                    <p>{{lang[local].pushCoinEWM}}</p>
                </section>
                <section class="pushCoin-right" :class="classActive((walletData && walletData.title_key))">
                    <section :class="classActive(!(walletData && walletData.title_key))">
                        <h4>{{lang[local].pushCoinUrl}}: </h4>
                        <div>
                            <span :title="walletData && walletData.address">{{walletData && walletData.address}}</span> <br />
                            <a href="javascript:;"><copy :val="(walletData && walletData.address) || ''">{{lang[local].copyUrl}}</copy></a>
                        </div>
                    </section>
                    <section v-if="walletData && walletData.title_key">
                        <h4>{{walletData && walletData.title_key}}: </h4>
                        <div>
                            <span :title="walletData && walletData.title_value">{{walletData && walletData.title_value}}</span>
                            <a href="javascript:;"><copy :val="(walletData && walletData.title_value) || ''">{{lang[local].copyUrl2}}</copy></a>
                        </div>
                    </section>
                </section>
            </section>
            <section class="pushCoin" v-else-if="balance.state == 1 && balance.zr_jz == 1">
            <!--<section class="pushCoin">-->
                <section class="finance-form" style="min-height: auto;">
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="upmyzr" class="form-submit-btn">{{lang[local].clickPushCoinURL}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    </section>
                </section>
            </section>
            <!-- <section class="finance-hint"  v-if="active == 0">
                {{lang[local].walletActiveText}}
                <a href="javascript:;" class="buyColor" @click="activateAddr">{{lang[local].selfActive}}</a> (<span class="mainColor">{{lang[local].pay}}1CNT</span> )
            </section> -->
        </section>

        <h4 class="finance-title">
            <span>{{lang[local].pushCoinRecord}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.myzrLog" :param="routeParam">
            <dl slot="head">
                <dd style="width:20%">{{lang[local].pushCoinTime}}</dd>
                <dd style="width:30%">{{lang[local].pushCoinId}}</dd>
                <dd style="width:30%">{{lang[local].pushCoinURL}}</dd>
                <dd style="width:10%">{{lang[local].pushCoinNum}}</dd>
                <dd style="width:10%">{{lang[local].pushCoinState}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd style="width:20%">{{localDate(item.addtime)}}</dd>
                <dd style="width:30%"><span class="line-feed">{{item.id}}</span></dd>
                <dd style="width:30%"><span class="line-feed">{{item.to}}</span></dd>
                <dd style="width:10%">{{item.num}}</dd>
                <dd style="width:10%"><span class="mainColor">{{item.state}}</span></dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "push-coin",
        data (){
            return {
                coin : '',
                active : 1,
                walletData : null,
                balance : {},
            };
        },
        computed : {
            routeParam (){
                return {
                    coin : this.lowerCase(this.coin)
                };
            },
        },
        watch : {
            balance (n, o){
                if(n.state == 2){
                    this.$router.push('./index');
                };
            },
        },
        created (){
            this.coinChange();
            this.myzrads();
        },
        beforeRouteUpdate (to, from ,next){
            next();
            this.coinChange();
            this.myzrads();
        },
        methods : {
            upmyzr (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.upmyzr,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.walletData = res.data;
                    this.$store.commit('msg/add', this.lang[this.local].pushCoinSuccess);
                    // this.myaddrstatus();
                }).catch((err) => {
                    this.getError();
                    this.walletData = null;
                    this.$store.commit('msg/err', err.message || this.lang[this.local].pushCoinError);
                });
            },
            myzrads (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.myzrads,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.walletData = res.data;
                    // this.myaddrstatus();
                }).catch((err) => {
                    this.getError();
                    this.walletData = null;
                    this.$store.commit('msg/err', err.message || this.lang[this.local].pushCoinError);
                });
            },
            // myaddrstatus (){
            //     this.axios({
            //         url : this.api.myaddrstatus,
            //         data : {
            //             coin : this.lowerCase(this.coin)
            //         },
            //     }).then((res) => {
            //         console.log(res);
            //         this.active = res.data.active || 0;
            //     }).catch((err) => {
            //         this.$store.commit('msg/err', err.message || this.lang[this.local].getWalletActiveS);
            //     });
            // },
            activateAddr (){
                this.axios({
                    url : this.api.activateAddr,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.active = 1;
                    this.$store.commit('msg/err', err.message || this.lang[this.local].walletActiveS);
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].walletActiveE);
                });
            },
        }
    }
</script>

