<template>
    <section  class="safety-block">
        <financeHeader>
            <span>{{lang[local].uppassword1}}</span>
            <!-- <span class="tips"><Icon type="information-circled" color="#ff0000"/> {{lang[local].tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang[local].uppassword1}}</span> -->
        </financeHeader>
        <section class="safety-form">
            <div class="tit">{{lang[local].uppassword1}}</div>
            <section class="form-group">
                <div class="input-box">
                    <i class="iconfont icon-mima" ></i> <input type="password" @keyup.enter="uppassword"  v-model="param.oldpwd" name="safety-trade-oldpaypwd" :placeholder="lang[local].uppassword2" />
                </div>
            </section>
            <section class="form-group">
                <div class="input-box">
                    <i class="iconfont icon-mima" ></i> <input type="password" @keyup.enter="uppassword" v-model="param.newpwd" name="safety-trade-newpaypwd" :placeholder="lang[local].uppassword3" />
                </div>
            </section>
            <section class="form-group">
                <div class="input-box">
                    <i class="iconfont icon-mima" ></i> <input type="password" @keyup.enter="uppassword" v-model="param.repwd" name="safety-trade-repaypwd" :placeholder="lang[local].uppassword4" />
                </div>
            </section>
            <!-- <section class="form-group" style="text-align: right">
                <a :href="forgetPwdUrl">{{lang[local].forgetPwd}}</a>
            </section> -->
            <section class="login-form-group">
                <span class="tips" style="color:#999">{{lang[local].loginTips}}</span>
            </section>
            <section class="form-group form-group-btn">
                <a href="javascript:;" @click="uppassword" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                <a href="javascript: history.go(-1);" class="form-submit-btn white" >{{lang[local].cancel}}</a>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "uppassword",
        data (){
            return {
                param : {
                    oldpwd : '',
                    newpwd : '',
                    repwd : '',
                },
            };
        },
        watch : {
            "param.newpwd" (n, o){
                if(n.length > this.passwordMaxLen) {
                    this.param.password = o;
                };
                this.param.password = this.replacePwd(n);
            },
        },
        created (){
        },
        methods : {
            uppassword (){

                if(this.getState == this.getStateStart){
                    return false;
                };

                var {oldpwd, newpwd, repwd} = this.param;
                if(oldpwd.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].uppassword7);
                    return false;
                };
                if(this.pwdJudge(newpwd)){
                    this.$store.commit('msg/err', this.lang[this.local].password);
                    return false;
                };
                if(repwd != newpwd){
                    this.$store.commit('msg/err', this.lang[this.local].uppassword6);
                    return false;
                };

                this.getStart();

                this.axios({
                    url : this.api.uppassword,
                    data : {
                        oldpwd,
                        newpwd,
                        repwd,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].uppassword5);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].uppassword5);
                });

            },
        },
    }
</script>

