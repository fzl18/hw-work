<template>
    <section>
        <financeHeader>
            <span>{{lang[local].addAliPay}}</span>
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
                    <label>{{lang[local].gu_finance25}}</label>
                    <input v-model="account" type="text" :placeholder="lang[local].gu_finance22" />
                </section>
                <section class="form-group">
                    <label>{{lang[local].gu_finance26}}</label>
                    <section>
                        <uploadFile v-model="alipay" path="aliPay">
                            <div class="input input-wallet">
                                <span class="progress" v-if="alipay.state == getStateStart">
                                    <i :style="{width : alipay.progress + '%'}"></i>
                                    {{alipay.file}}
                                </span>
                                <load class="min" v-if="alipay.state == getStateStart" />
                                <span v-else>{{alipay.data ? alipay.data : lang[local].gu_finance23}}</span>
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
        name: "add-alipay",
        data (){
            return {
                alipay : {},
                account : '',
            }
        },
        watch : {
            alipay (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang[local].gu_finance29);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang[local].gu_finance28);
                };
            },
        },
        created (){
            // if(this.loginStatus && !this.loginInfo.truename){
            //     this.$store.commit('msg/err', this.lang[local].nameAuth29);
            //     setTimeout(() => {
            //         location.href = this.truenametUrl;
            //     }, 1500)
            // };
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
                    this.$store.commit('msg/err', this.lang[local].gu_finance50);
                    return;
                };
                if (!this.alipay.data){
                    this.$store.commit('msg/err', this.lang[local].gu_finance51);
                    return;
                };
                this.getStart();
                this.axios({
                    url : this.api.updatepay,
                    data : {
                        type : 1,
                        alipay : this.account,
                        alipaycode : this.alipay.data,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[local].gu_finance52);
                    this.$router.push('./myPay');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[local].gu_finance53);
                });
            }
        }
    }
</script>

