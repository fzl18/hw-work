<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.mobileBind}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang.mobileBind}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <input type="text" v-model="mobile"  @keyup.enter="upmoble" name="safety-upmoble" :placeholder="lang.phone" />
                </section>
                <section class="form-group">
                    <input type="text" v-model="verify" @keyup.enter="upmoble" name="safety-upmoble-verify" :placeholder="lang.SMSVerifCode" />
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
                    <a href="javascript:;" @click="upmoble" class="form-submit-btn">{{lang.gaCode10}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "mobile-bind",
        data (){
            return {
                sendCodeCount : 0,
                mobile : '',
                verify : '',
            };
        },
        methods : {
            upmoble (){

                if(this.getState == this.getStateStart){
                    return false;
                };

                var {mobile:moble, verify:moble_verify} = this;
                if(moble.length != 11){
                    this.$store.commit('msg/err', this.lang.phoneError);
                    return false;
                };

                if(this.sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang.sendVerifCode);
                    return false;
                };

                if(moble_verify.length != this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang.enterVerifCode);
                    return false;
                };

                this.getStart();

                this.axios({
                    url : this.api.upmoble,
                    data : {
                        moble,
                        moble_verify,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.tradePassword14);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.tradePassword15);
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                if(this.mobile.length != 11){
                    this.$store.commit('msg/err', this.lang.phoneError);
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.upmobleVerify,
                    data : {
                        moble : this.mobile
                    }
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                });
            }
        }
    }
</script>

