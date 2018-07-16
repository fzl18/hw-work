<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.tradePassword11}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang.tradePassword11}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <input type="text" @keyup.enter="findPayPwd" v-model="param.verify" name="safety-trade-verify" :placeholder="lang.SMSVerifCode" />
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
                <section class="form-group">
                    <input type="password"  @keyup.enter="findPayPwd" v-model="param.newpaypwd" name="safety-trade-newpaypwd" :placeholder="lang.tradePassword3" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="findPayPwd" v-model="param.repaypwd" name="safety-trade-repaypwd" :placeholder="lang.tradePassword4" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="findPayPwd" class="form-submit-btn">{{lang.confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <router-link to="./upTradePassword" class="form-submit-btn white">{{lang.tradePassword9}}</router-link>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "findTradePassword",
        data (){
            return {
                sendCodeCount : 0,
                param : {
                    verify : '',
                    newpaypwd : '',
                    repaypwd : '',
                },
            };
        },
        watch : {
            "param.verify" (n, o){
                if(n.length > this.verifCodeLen){
                    this.param.verify = o;
                    return;
                };
                this.param.verify = n.replace(/[^0-9]*/g, '');
            },
        },
        created (){
            if(this.userBasicinfo && this.userBasicinfo.userid && !this.userBasicinfo.paypassword){
                this.$router.push('./setTradePassword');
            };
        },
        methods : {
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.findPayPwdVerify,
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                });
            },
            findPayPwd (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang.sendVerifCode);
                    return false;
                };
                var {newpaypwd, repaypwd, verify} = this.param;
                if(verify.length < this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang.enterVerifCode);
                    return false;
                };
                if(newpaypwd.length < 8){
                    this.$store.commit('msg/err', this.lang.tradePassword6);
                    return false;
                };
                if(newpaypwd != repaypwd){
                    this.$store.commit('msg/err', this.lang.tradePassword8);
                    return false;
                };

                this.getStart();

                this.axios({
                    url : this.api.findPayPwd,
                    data : {
                        newpaypwd,
                        repaypwd,
                        verify,
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
        },
    }
</script>

