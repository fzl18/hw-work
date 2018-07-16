<template>
    <section>
        <financeHeader>
            <span>{{lang.addAliPay}}</span>
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
                    <label>{{lang.gu_finance25}}</label>
                    <input v-model="account" type="text" :placeholder="lang.gu_finance22" />
                </section>
                <section class="form-group">
                    <label>{{lang.gu_finance26}}</label>
                    <section>
                        <uploadFile v-model="alipay" path="aliPay">
                            <div class="input input-wallet">
                                <span class="progress" v-if="alipay.state == getStateStart">
                                    <i :style="{width : alipay.progress + '%'}"></i>
                                    {{alipay.file}}
                                </span>
                                <load class="min" v-if="alipay.state == getStateStart" />
                                <span v-else>{{alipay.data ? alipay.data : lang.gu_finance23}}</span>
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
                    this.$store.commit('msg/add', this.lang.gu_finance29);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang.gu_finance28);
                };
            },
        },
        created (){
            // if(this.loginStatus && !this.loginInfo.truename){
            //     this.$store.commit('msg/err', this.lang.nameAuth29);
            //     setTimeout(() => {
            //         location.href = this.truenametUrl;
            //     }, 1500)
            // };
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
                    this.$store.commit('msg/err', this.lang.gu_finance50);
                    return;
                };
                if (!this.alipay.data){
                    this.$store.commit('msg/err', this.lang.gu_finance51);
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
                    this.$store.commit('msg/add', this.lang.gu_finance52);
                    this.$router.push('./myPay');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance53);
                });
            }
        }
    }
</script>

