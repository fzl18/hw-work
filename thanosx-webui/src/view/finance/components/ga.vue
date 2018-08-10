<template>
    <section  class="safety-block">
        <financeHeader>
            <span>{{lang[local].gaCode1}}</span>
        </financeHeader>
        <div class="tit">
            {{lang[local].gaCode2}}
        </div>
        <section class="gaCode">
            <section class="gaCode-block">
                <i class="gaCode-block-icon">1</i>
                <h4>{{lang[local].gaCode3}}</h4>
                <div class="gaCode-block-text" v-html="lang[local].gaCode4"></div>
                <div class="gaCode-block-btn">
                    <a href="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8" target="_blank"> <i class="iconfont icon-ai-ios"></i> APP Store</a>
                    <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank"><i class="iconfont icon-guge-play"></i> Google Play</a>
                </div>
            </section>
            <section class="gaCode-block">
                <i class="gaCode-block-icon">2</i>
                <h4>{{lang[local].gaCode5}}</h4>
                <div class="gaCode-block-text">
                    <p>{{lang[local].gaCode6}}</p>
                    <p class="mainColor">{{lang[local].gaCode7}}</p>
                </div>
                <div class="gaCode-block-ewm">
                    <div class="ewm" @click="getEwm">
                        <ewm :value="qrCodeUrl"></ewm>
                    </div>
                    <div class="key">
                        <p>{{lang[local].gaCode8}}</p>
                        <p>
                            <span>{{Asecret}}</span>
                            <p class="mainColor">
                                <copy :val="Asecret">{{lang[local].copy}}</copy>
                            </p>
                        </p>
                    </div>
                </div>
            </section>
            <section class="gaCode-block">
                <i class="gaCode-block-icon">3</i>
                <h4>{{lang[local].gaCode9}}</h4>
                <section class="safety-form" style="box-shadow:none;padding:0">
                    <section class="form-group">
                        <div class="input-box">
                        <input type="text" v-model="token" @keyup.enter="bindGa"  name="safety-answer" :placeholder="lang[local]['4009']" />
                        </div>
                    </section>
                    <section class="form-group">
                        <a href="javascript:;" @click="bindGa" class="form-submit-btn">{{lang[local].gaCode10}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    </section>
                </section>
            </section>
        </section>
    </section>

</template>

<script>

    export default {
        name: "ga",
        data (){
            return {
                qartElm : null,
                Asecret : '',
                token : '',
                qrCodeUrl : '',
            };
        },
        created (){
            this.getEwm();
        },
        mounted (){

        },
        methods : {
            getEwm (){
                this.axios({
                    url : this.api.ga
                }).then((res) => {
                    this.qrCodeUrl = res.data.qrCodeUrl;
                    this.Asecret = res.data.Asecret;
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].getGaError);
                    this.getEwm();
                });
            },
            bindGa (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.token.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].ga1);
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.bindGa,
                    data : {
                        token : this.token,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].ga2);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].ga3);
                });

            },
        },
    }
</script>

