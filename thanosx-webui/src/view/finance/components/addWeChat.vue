<template>
    <section>
        <financeHeader>
            <span>{{lang.addWeChat}}</span>
        </financeHeader>
        <form>
            <section class="finance-form">
                <section class="form-group">
                    <label>{{lang.gu_finance24}}</label>
                    <section class="text">
                        <span v-if="loginInfo.truename">{{loginInfo.truename}}<small> ({{lang.nameAuth1}}{{lang.nameAuth5}})</small></span>
                        <a v-else :href="truenametUrl">{{lang.nameAuth29}}</a>
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.gu_finance34}}</label>
                    <input v-model="account" type="text" :placeholder="lang.gu_finance32" />
                </section>
                <section class="form-group">
                    <label>{{lang.gu_finance35}}</label>
                    <section>
                        <uploadFile v-model="weChat" path="weChat">
                            <div class="input input-wallet">
                                <span class="progress" v-if="weChat.state == getStateStart">
                                    <i :style="{width : weChat.progress + '%'}"></i>
                                    {{weChat.file}}
                                </span>
                                <load class="min" v-if="weChat.state == getStateStart" />
                                <span v-else>{{weChat.data ? weChat.data : lang.gu_finance33}}</span>
                            </div>
                        </uploadFile>
                    </section>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uploadData" class="form-submit-btn">{{lang.gu_finance27}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
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
                    this.$store.commit('msg/add', this.lang.gu_finance37);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang.gu_finance36);
                };
            },
        },
        methods : {
            uploadData (){
                if(!this.loginInfo.truename){
                    this.$store.commit('msg/err', this.lang.nameAuth29);
                    return false;
                };
                if(this.getState == this.getStateStart){
                    return false;
                };
                if (this.account == ''){
                    this.$store.commit('msg/err', this.lang.gu_finance54);
                    return;
                };
                if (!this.weChat.data){
                    this.$store.commit('msg/err', this.lang.gu_finance55);
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
                    this.$store.commit('msg/add', this.lang.gu_finance56);
                    this.$router.push('./myPay');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance57);
                });
            }
        }
    }
</script>

