<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].tradePassword1}}</span>
                <span class="tips"><Icon type="information-circled" color="#ff0000"/> {{lang[local].tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang[local].tradePassword1}}</span>
            </financeHeader>
            <section class="safety-form">
                <div class="tit">{{lang[local].tradePassword1}}</div>
                <p>{{lang[local].email}}：{{userBasicinfo.username}}</p>
                <section class="form-group">
                    <div class="input-box">
                       <i class="iconfont icon-yanzhengma"></i> <input type="text" v-model="verify" @keyup.enter="uppaypassword" name="safety-upmoble-verify" :placeholder="lang[local].emailVerifCode" />
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
                     <i class="iconfont icon-mima" ></i> <input type="password"  @keyup.enter="uppaypassword" v-model="param.newpaypwd" name="safety-trade-setnewpaypwd" :placeholder="lang[local].payPassword" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                        <i class="iconfont icon-mima" ></i> <input type="password" @keyup.enter="uppaypassword" v-model="param.repaypwd" name="safety-trade-setrepaypwd" :placeholder="lang[local].tradePassword4" />
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uppaypassword" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <a href="javascript: history.go(-1);" class="form-submit-btn white" >{{lang[local].cancel}}</a>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "setTradePassword",
        data (){
            return {
                param : {
                    newpaypwd : '',
                    repaypwd : '',
                    
                },
                sendCodeCount : 0,
                verify : '',
            };
        },
        created (){
            if(this.userBasicinfo && this.userBasicinfo.userid && this.userBasicinfo.paypassword){
                this.$router.push('./upTradePassword');
            };
        },
        methods : {
            uppaypassword (){
                if(this.getState == this.getStateStart){
                    return false;
                };

                var {newpaypwd, repaypwd} = this.param;
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
                    url : this.api.uppaypassword,
                    data : {
                        newpaypwd,
                        repaypwd,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].tradePassword13);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].tradePassword12);
                });

            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.upmobleVerify,
                    data : {
                        email : this.userBasicinfo.username
                    }
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                });
            }
        },
    }
</script>

