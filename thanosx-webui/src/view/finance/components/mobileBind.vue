<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].mobileBind}}</span>
            </financeHeader>

            <section class="safety-form">
                <div class="tit">{{lang[local].mobileBind}}</div>
                <section class="form-group">
                    <div class="input-box">
                    <i class="iconfont icon-shoujihao"></i> <input type="text" v-model="mobile"  @keyup.enter="upmoble" name="safety-upmoble" :placeholder="lang[local].phone" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                       <i class="iconfont icon-yanzhengma"></i> <input type="text" v-model="verify" @keyup.enter="upmoble" name="safety-upmoble-verify" :placeholder="lang[local].SMSVerifCode" />
                        <span @click="sendVerify" class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
                            {{
                                verifyCodeTimeText == -1
                                ? lang[local].getVerifCode + '...'
                                : verifyCodeTimeText
                                ? verifyCodeTimeText
                                : lang[local].getVerifCode
                            }}
                        </span>
                    </div>                    
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="upmoble" class="form-submit-btn">{{lang[local].gaCode10}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <a href="javascript: history.go(-1);" class="form-submit-btn white" >{{lang[local].cancel}}</a>
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
                    this.$store.commit('msg/err', this.lang[this.local].phoneError);
                    return false;
                };

                if(this.sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].sendVerifCode);
                    return false;
                };

                if(moble_verify.length != this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode);
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
                    this.$store.commit('msg/add', this.lang[this.local].tradePassword14);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].tradePassword15);
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                if(this.mobile.length != 11){
                    this.$store.commit('msg/err', this.lang[this.local].phoneError);
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

