<template>
    <section class="safety-block">
        <financeHeader>
            <span>{{lang[local].addWallet}}</span>
        </financeHeader>
        <form>
            <section class="safety-form">
                <div class="tit">
                    {{lang[local].addWallet}}
                </div>
                <section class="form-group">
                    <!-- <label>{{lang[local].gu_finance43}}</label> -->
                    <div class="input-box">
                    <select-my class="safety-issue-select" v-model="coinname" :list="coinList" selected="" @change="coinChange" />
                    </div>
                </section>
                <section class="form-group">
                    <!-- <label>{{lang[local].walletUrl}}</label> -->
                    <div class="input-box">
                    <input type="text" v-model="addr" :placeholder="lang[local].walletUrl" style="width:100%"/>
                    </div>
                </section>
                <section class="form-group" v-if="qb_title">
                    <!-- <label>{{qb_title}}</label> -->
                    <div class="input-box">
                    <input type="text" v-model="addr_child" :placeholder="qb_title" style="width:100%"/>
                    </div>
                </section>
                <section class="form-group">
                    <!-- <label>{{lang[local].walletName}}</label> -->
                    <div class="input-box">
                    <input type="text" v-model="name" :placeholder="lang[local].walletName" style="width:100%"/>
                    </div>
                </section>
                <!-- <section class="form-group" style="text-align: right">
                    <div>
                        <label class="checkbox-my big">
                            <input type="checkbox" v-model="is_default" />
                            <i></i>
                            {{lang[local].authWallet}}
                        </label>
                    </div>
                </section> -->
                <!--<section class="form-group" v-if="is_default">
                    <label>{{lang[local].payPassword}}</label>
                    <input type="password" :placeholder="lang[local].payPassword" />
                </section>-->
                <!-- <section class="form-group" v-if="is_default">
                    <label>{{lang[local].verifCode}}</label>
                    <input type="text" v-model="moble_verify" :placeholder="lang[local].SMSVerifCode" />
                    <span @click="sendVerify" class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
                        {{
                            verifyCodeTimeText == -1
                            ? lang[local].getVerifCode + '...'
                            : verifyCodeTimeText
                            ? verifyCodeTimeText
                            : lang[local].getVerifCode
                        }}
                    </span>
                </section> -->
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="upqianbao" class="form-submit-btn">{{lang[local].gu_finance27}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <a href="javascript:;" @click="$router.go(-1)" class="form-submit-btn white">{{lang[local].cancel}}</a>
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
                    this.$store.commit('msg/err', this.lang[this.local].selectCoin)
                    return false;
                };
                if(!addr){
                    this.$store.commit('msg/err', this.lang[this.local].walletUrlEmpty)
                    return false;
                };
                if(!name){
                    this.$store.commit('msg/err', this.lang[this.local].walletNameEmpty)
                    return false;
                };
                if(is_default && sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].sendVerifCode)
                    return false;
                };
                if(is_default && moble_verify.length != this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode)
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
                    this.$store.commit('msg/err', this.lang[this.local].addWalletSuccess);
                    this.$router.push('./myWallet');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].addWalletError)
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
                    this.$store.commit('msg/err', err.message || this.lang[this.local].sendVerifCodeError);
                });
            },
            getcoinList (){
                this.axios({
                    url : this.api.coinList,
                }).then((res) => {
                    var data = res.data || [];
                    var coinList = [['', this.lang[this.local].selectCoin]];
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
                    this.$store.commit('msg/del', this.lang[this.local].selectCoin)
                }else{
                    this.$store.commit('msg/err', this.lang[this.local].selectCoin)
                };
            },
        }
    }
</script>

