<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].tradePassword1}}</span>
                <!-- <span class="tips"><Icon type="information-circled" color="#ff0000"/> {{lang[local].tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang[local].tradePassword1}}</span> -->
            </financeHeader>
            <section class="safety-form">
                <div class="tit">{{lang[local].tradePassword1}}</div>
                <p>{{lang[local].email + '：' +userBasicinfo.username}}</p>
                <section class="form-group">
                    <div class="input-box">
                        <i class="iconfont icon-yanzhengma"></i> <input type="text" @keyup.enter="findPayPwd" v-model="param.verify" name="safety-trade-verify" :placeholder="lang[local].emailVerifCode" />
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
                <section class="form-group">
                    <div class="input-box">
                    <i class="iconfont icon-mima"></i> <input type="password"  @keyup.enter="findPayPwd" v-model="param.newpaypwd" name="safety-trade-newpaypwd" :placeholder="lang[local].tradePassword3" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <i class="iconfont icon-mima"></i> <input type="password" @keyup.enter="findPayPwd" v-model="param.repaypwd" name="safety-trade-repaypwd" :placeholder="lang[local].tradePassword4" />
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="findPayPwd" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <a href="javascript:history.go(-1);" class="form-submit-btn white">{{lang[local].cancel}}</a>
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
                    this.$store.commit('msg/err', this.lang[this.local].sendVerifCode);
                    return false;
                };
                var {newpaypwd, repaypwd, verify} = this.param;
                if(verify.length < this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode);
                    return false;
                };
                if(newpaypwd.length < 8){
                    this.$store.commit('msg/err', this.lang[this.local].tradePassword6);
                    return false;
                };
                if(newpaypwd != repaypwd){
                    this.$store.commit('msg/err', this.lang[this.local].tradePassword8);
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
                    this.$store.commit('msg/add', this.lang[this.local].tradePassword14);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].tradePassword15);
                });

            },
        },
    }
</script>

