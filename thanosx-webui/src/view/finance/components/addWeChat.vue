<template>
    <section>
        <financeHeader>
            <span>{{lang[local].addWeChat}}</span>
        </financeHeader>
        <form>
            <section class="finance-form">
                <section class="form-group">
                    <label>{{lang[local].gu_finance24}}</label>
                    <section class="text">
                        <span v-if="loginInfo.truename">{{loginInfo.truename}}<small> ({{lang[local].nameAuth1}}{{lang[local].nameAuth5}})</small></span>
                        <a v-else :href="truenametUrl">{{lang[local].nameAuth29}}</a>
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang[local].gu_finance34}}</label>
                    <input v-model="account" type="text" :placeholder="lang[local].gu_finance32" />
                </section>
                <section class="form-group">
                    <label>{{lang[local].gu_finance35}}</label>
                    <section>
                        <uploadFile v-model="weChat" path="weChat">
                            <div class="input input-wallet">
                                <span class="progress" v-if="weChat.state == getStateStart">
                                    <i :style="{width : weChat.progress + '%'}"></i>
                                    {{weChat.file}}
                                </span>
                                <load class="min" v-if="weChat.state == getStateStart" />
                                <span v-else>{{weChat.data ? weChat.data : lang[local].gu_finance33}}</span>
                            </div>
                        </uploadFile>
                    </section>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uploadData" class="form-submit-btn">{{lang[local].gu_finance27}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <a href="javascript:;" @click="$router.go(-1)" class="form-submit-btn white">{{lang[local].cancel}}</a>
                </section>
            </section>
        </form>
    </section>
</template>

<script>
    export default {
        name: "add-WeChat",
        data (){
            return {
                weChat : {},
                account : '',
            }
        },
        watch : {
            weChat (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang[local].gu_finance37);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang[local].gu_finance36);
                };
            },
        },
        methods : {
            uploadData (){
                if(!this.loginInfo.truename){
                    this.$store.commit('msg/err', this.lang[local].nameAuth29);
                    return false;
                };
                if(this.getState == this.getStateStart){
                    return false;
                };
                if (this.account == ''){
                    this.$store.commit('msg/err', this.lang[local].gu_finance54);
                    return;
                };
                if (!this.weChat.data){
                    this.$store.commit('msg/err', this.lang[local].gu_finance55);
                    return;
                };
                this.getStart();
                this.axios({
                    url : this.api.updatepay,
                    data : {
                        type : 1,
                        wechatpay : this.account,
                        wechatpaycode : this.weChat.data,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[local].gu_finance56);
                    this.$router.push('./myPay');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[local].gu_finance57);
                });
            }
        }
    }
</script>

