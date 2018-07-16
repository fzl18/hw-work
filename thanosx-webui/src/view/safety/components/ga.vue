<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.gaCode1}}</span></h4>
            <section class="safety-hint">
                {{lang.gaCode2}}
            </section>
            <section class="gaCode">
                <section class="gaCode-block">
                    <i class="gaCode-block-icon">1</i>
                    <h4>{{lang.gaCode3}}</h4>
                    <div class="gaCode-block-text" v-html="lang.gaCode4"></div>
                    <div class="gaCode-block-btn">
                        <a href="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8" target="_blank">APP Store</a>
                        <a href="http://sj.qq.com/myapp/detail.htm?apkName=com.google.android.apps.authenticator2" target="_blank">Google Play</a>
                    </div>
                </section>
                <section class="gaCode-block">
                    <i class="gaCode-block-icon">2</i>
                    <h4>{{lang.gaCode5}}</h4>
                    <div class="gaCode-block-text">
                        <p>{{lang.gaCode6}}</p>
                        <p class="mainColor">{{lang.gaCode7}}</p>
                    </div>
                    <div class="gaCode-block-ewm">
                        <div class="ewm" @click="getEwm">
                            <ewm :value="qrCodeUrl"></ewm>
                        </div>
                        <div class="key">
                            <p>{{lang.gaCode8}}</p>
                            <p>
                                <span>{{Asecret}}</span>
                                <span class="mainColor">
                                    <copy :val="Asecret">{{lang.copy}}</copy>
                                </span>
                            </p>
                        </div>
                    </div>
                </section>
                <section class="gaCode-block">
                    <i class="gaCode-block-icon">3</i>
                    <h4>{{lang.gaCode9}}</h4>
                    <section class="safety-form">
                        <section class="form-group">
                            <input type="text" v-model="token" @keyup.enter="bindGa"  name="safety-answer" :placeholder="lang['4009']" />
                        </section>
                        <section class="form-group">
                            <a href="javascript:;" @click="bindGa" class="form-submit-btn">{{lang.gaCode10}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                        </section>
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
                    this.$store.commit('msg/err', err.message || this.lang.getGaError);
                    this.getEwm();
                });
            },
            bindGa (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.token.length <= 0){
                    this.$store.commit('msg/err', this.lang.ga1);
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
                    this.$store.commit('msg/add', this.lang.ga2);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.ga3);
                });

            },
        },
    }
</script>

