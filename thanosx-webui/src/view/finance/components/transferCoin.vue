<template>
    <section>
        <financeHeader>
            <span>{{lang[local].transferCoin}}</span>
        </financeHeader>
        <section class="finance-coin">
            <balance v-model="balance" :coin="coin" />
            <section class="takeCoin ban" v-if="balance.state == 1 && balance.zcother_jz != 1">
                {{upperCase(coin)}} {{lang[local].transferBan}}
            </section>
            <section class="takeCoin" v-if="balance.state == 1 && balance.zcother_jz == 1">
                <section class="takeCoin-form finance-form">
                    <section class="form-group">
                        <label>{{lang[local].transferCoinType}}</label>
                        <section class="text">
                            {{upperCase(coin)}}
                        </section>
                    </section>
                    <section class="form-group">
                        <label>{{lang[local].receiveCoinUser}}</label>
                        <input @keyup.enter="zcother" type="text" v-model="username" :placeholder="lang[local].receiveCoinUser" />
                    </section>
                    <section class="form-group">
                        <label>{{lang[local].transferCoinNum}}</label>
                        <input @keyup.enter="zcother" type="text" v-model="amount" @blur="amount > balance.xnb ? amount = balance.xnb : ''" :placeholder="lang[local].transferCoinNum" />
                    </section>
                    <section class="form-group">
                        <label>{{lang[local].payPassword}}</label>
                        <input @keyup.enter="zcother" type="password" v-model="paypassword" :placeholder="lang[local].payPassword" />
                    </section>
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="zcother" class="form-submit-btn">{{lang[local].transfer}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    </section>
                </section>
            </section>
        </section>

        <h4 class="finance-title">
            <span>{{lang[local].transferCoinRecord}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.ZcListOfIn" :param="routeParam" >
            <dl slot="head">
                <dd>{{lang[local].transferCoinTime}}</dd>
                <dd>{{lang[local].transferCoinId}}</dd>
                <dd>{{lang[local].transferCoinURL}}</dd>
                <dd>{{lang[local].transferCoinNum}}</dd>
                <dd>{{lang[local].transferCoinState}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd>{{localDate(item.addtime)}}</dd>
                <dd>{{item.id}}</dd>
                <dd>{{item.otherusername}}</dd>
                <dd :class="item.type == 2 ? 'buyColor' : 'sellColor'">{{item.num}}</dd>
                <dd><span :class="item.type == 2 ? 'buyColor' : 'sellColor'">{{item.type == 2 ? lang[local].transferCoinSuccess : lang[local].transferCoinSuccess2}}</span></dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "transferCoin",
        data (){
            return {
                coin : '',
                username : '',
                paypassword : '',
                amount : '',
                balance : {},
                upList : 1,
            };
        },
        watch : {
            amount (n, o){
                n = (n + '').replace(/[^0-9\.]/g, '');
                this.amount = Number.parseFloat(n) || '';
            },
        },
        computed : {
            routeParam (){
                return {
                    coin : this.lowerCase(this.coin),
                    upList : this.upList
                };
            },
        },
        created (){
            this.coinChange();
        },
        beforeRouteUpdate (to, from ,next){
            next();
            this.coinChange();
        },
        methods : {
            zcother (){
                if(this.getState == this.getStateStart){
                    return false;
                };

                var {coin, username, amount, paypassword} = this;
                if(!username){
                    this.$store.commit('msg/err', this.lang[local].receiveCoinUserEmpty);
                    return false;
                };
                if(!amount){
                    this.$store.commit('msg/err', this.lang[local].transferCoinNumEmpty);
                    return false;
                };
                if(!paypassword){
                    this.$store.commit('msg/err', this.lang[local].payPasswordNoEmpty);
                    return false;
                };

                this.getStart();
                this.axios({
                    url : this.api.zcother,
                    data : {
                        coin : this.lowerCase(coin),
                        username, amount, paypassword
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[local].transferCoinSuccess);
                    // this.$router.push('./index');
                    this.username = '';
                    this.amount = '';
                    this.paypassword = '';
                    this.upList = this.upList + 1;
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[local].transferCoinError);
                });
            },
        }
    }
</script>

<style scoped>

</style>
