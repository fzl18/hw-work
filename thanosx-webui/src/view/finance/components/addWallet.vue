<template>
    <section>
        <financeHeader>
            <span>{{lang.addWallet}}</span>
        </financeHeader>
        <form>
            <section class="finance-form">
                <section class="form-group">
                    <label>{{lang.gu_finance43}}</label>
                    <select-my class="safety-issue-select" v-model="coinname" :list="coinList" selected="" @change="coinChange" />
                </section>
                <section class="form-group">
                    <label>{{lang.walletUrl}}</label>
                    <input type="text" v-model="addr" :placeholder="lang.walletUrl" />
                </section>
                <section class="form-group" v-if="qb_title">
                    <label>{{qb_title}}</label>
                    <input type="text" v-model="addr_child" :placeholder="qb_title" />
                </section>
                <section class="form-group">
                    <label>{{lang.walletName}}</label>
                    <input type="text" v-model="name" :placeholder="lang.walletName" />
                </section>
                <section class="form-group" style="text-align: right">
                    <div>
                        <label class="checkbox-my big">
                            <input type="checkbox" v-model="is_default" />
                            <i></i>
                            {{lang.authWallet}}
                        </label>
                    </div>
                </section>
                <!--<section class="form-group" v-if="is_default">
                    <label>{{lang.payPassword}}</label>
                    <input type="password" :placeholder="lang.payPassword" />
                </section>-->
                <section class="form-group" v-if="is_default">
                    <label>{{lang.verifCode}}</label>
                    <input type="text" v-model="moble_verify" :placeholder="lang.SMSVerifCode" />
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
                    <a href="javascript:;" @click="upqianbao" class="form-submit-btn">{{lang.gu_finance27}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <a href="javascript:;" @click="$router.go(-1)" class="form-submit-btn white">{{lang.cancel}}</a>
                </section>
            </section>
        </form>
    </section>
</template>

<script>
    export default {
        name: "add-alipay",
        data (){
            return {
                coinList : [],
                is_default : false,
                sendCodeCount : 0,
                qb_title : null,
                coinname: "",
                addr :"" ,
                name :"" ,
                moble_verify : '',
                addr_child : '',
            }
        },
        watch : {

        },
        created (){
            this.getcoinList();
        },
        methods : {
            upqianbao (){

                if(this.getState == this.getStateStart){
                    return false;
                };
                var {is_default, moble_verify, addr, addr_child, coinname, sendCodeCount, name} = this;

                if(!coinname){
                    this.$store.commit('msg/err', this.lang.selectCoin)
                    return false;
                };
                if(!addr){
                    this.$store.commit('msg/err', this.lang.walletUrlEmpty)
                    return false;
                };
                if(!name){
                    this.$store.commit('msg/err', this.lang.walletNameEmpty)
                    return false;
                };
                if(is_default && sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang.sendVerifCode)
                    return false;
                };
                if(is_default && moble_verify.length != this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang.enterVerifCode)
                    return false;
                };

                this.getStart();
                this.axios({
                    url : this.api.upqianbao,
                    data : {
                        is_default : is_default * 1, moble_verify, addr, addr_child, coinname, name
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/err', this.lang.addWalletSuccess);
                    this.$router.push('./myWallet');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.addWalletError)
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.freal,
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                    this.$store.commit('msg/err', err.message || this.lang.sendVerifCodeError);
                });
            },
            getcoinList (){
                this.axios({
                    url : this.api.coinList,
                }).then((res) => {
                    var data = res.data || [];
                    var coinList = [['', this.lang.selectCoin]];
                    data.forEach((q) => {
                        if(this.upperCase(q.name) == 'CNT'){
                            return;
                        };
                        coinList.push([q.name, this.upperCase(q.name), q.qb_title]);
                    });
                    this.coinList = coinList;
                }).catch((err) => {
                    console.log(err);
                });
            },
            coinChange (val){
                this.qb_title = val[2];
                if(val[0]){
                    this.$store.commit('msg/del', this.lang.selectCoin)
                }else{
                    this.$store.commit('msg/err', this.lang.selectCoin)
                };
            },
        }
    }
</script>

