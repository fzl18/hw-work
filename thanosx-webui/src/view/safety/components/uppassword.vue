<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.uppassword1}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang.uppassword1}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <input type="password" @keyup.enter="uppassword"  v-model="param.oldpwd" name="safety-trade-oldpaypwd" :placeholder="lang.uppassword2" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="uppassword" v-model="param.newpwd" name="safety-trade-newpaypwd" :placeholder="lang.uppassword3" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="uppassword" v-model="param.repwd" name="safety-trade-repaypwd" :placeholder="lang.uppassword4" />
                </section>
                <section class="form-group" style="text-align: right">
                    <a :href="forgetPwdUrl">{{lang.forgetPwd}}</a>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uppassword" class="form-submit-btn">{{lang.confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
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
                    this.$store.commit('msg/err', this.lang.uppassword7);
                    return false;
                };
                if(this.pwdJudge(newpwd)){
                    this.$store.commit('msg/err', this.lang.password);
                    return false;
                };
                if(repwd != newpwd){
                    this.$store.commit('msg/err', this.lang.uppassword6);
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
                    this.$store.commit('msg/add', this.lang.safetyIssue6);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.safetyIssue6);
                });

            },
        },
    }
</script>

