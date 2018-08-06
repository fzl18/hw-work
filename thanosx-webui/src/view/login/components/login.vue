<template>
    <section class="register">
        <h2 class="login-title"> <span>{{lang[local].loginTitle}}</span> {{lang[local].webName}}</h2>
        <section class="login-form">
            <section class="login-form-group">
                <div class="input-box">
                    <i class="iconfont icon-youxiang"></i> <input type="text"  @keyup.enter="submit"  v-model="param.username" name="login-mobile" :placeholder="lang[local].enterEmail" />
                </div>               
            </section>

            <section class="login-form-group" :class="gacodeStatus == this.apiStatus.gacode ? '' : 'login-form-group-margin'">
               <div class="input-box">
                    <i class="iconfont icon-mima"></i> <input class="register-paw"  @keyup.enter="submit"  type="password" v-model="param.password" name="login-password" :placeholder="lang[local].loginPassword" />
                    <router-link to="/resetPassword" class="login-select">{{lang[local].forgetPwd}}</router-link>
               </div>
            </section>

            <section class="login-form-group login-form-group-margin" v-if="gacodeStatus == this.apiStatus.gacode">
                <div class="input-box">
                    <i class="iconfont icon-mima"></i> <input class="register-paw"  @keyup.enter="submit"  type="text" v-model="param.gacode" name="login-gacode" :placeholder="lang[local]['4009']" />
                </div>
            </section>
            <section class="login-form-group login-form-group-margin2">
                <a href="javascript:;" @click="submit" class="login-btn">{{lang[local].login}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                <router-link to="/register" class="reg">{{lang[local].freeRegister}}</router-link>
            </section>
        </section>
    </section>
</template>

<script>
    import registerPasTip from './registerPasTip'
    export default {
        name: "login",
        data (){
            return {
                gacodeStatus : 0,
                param : {
                    username : '',
                    password : '',
                    verify : '',
                    gacode : '',
                }
            };
        },

        created (){
        },

        watch : {
            "param.username" (n, o){

                // if(n.length > 11) {
                //     this.param.username = o;
                //     return;
                // };
                //
                // this.param.username = n.replace(/[^0-9]*/g, '');

                if(n){
                    this.$store.commit('tips/hide', this.lang[this.local].enterName);
                };

                // if(this.param.username.length == 11){
                //     this.$store.commit('tips/hide', this.lang[this.local].phoneError);
                // };
            },
            "param.password" (n, o){
                if(n){
                    this.$store.commit('tips/hide', this.lang[this.local].passwordEmpty);
                }
                // this.param.password = n.replace(/[^0-9a-zA-Z\.\\\/\(\)\_\-\+\=\~\!\@\#\$\%\^\&\*\?\'\<\>]*/g, '');
                // if(/^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$/g.test(this.param.password)){
                //     this.$store.commit('tips/hide', this.lang[this.local].password);
                // };
            },
        },

        mounted (){
            this.$store.commit('tips/add', {
                text : this.lang[this.local].enterName,
                el : "[name='login-mobile']",
                status : false,
            });

            // this.$store.commit('tips/add', {
            //     text : this.lang[this.local].phoneError,
            //     el : "[name='login-mobile']",
            //     status : false,
            // });

            // this.$store.commit('tips/add', {
            //     text : this.lang[this.local].password,
            //     el : "[name=login-password]",
            //     status : false,
            // });
            this.$store.commit('tips/add', {
                text : this.lang[this.local].passwordEmpty,
                el : "[name=login-password]",
                status : false,
            });
        },

        methods : {

            getPasswordStatus (){
                return this.$store.getters['tips/tip']['registerPasTip'].tipsData || {};
            },

            usernameFocus (){
                // if(!this.usernameBlur()){
                //     this.$store.commit('tips/hide', this.lang[this.local].password);
                // };
                // this.$store.commit('tips/hide', this.lang[this.local].enterName);
            },

            usernameBlur (){
                if(this.param.username == ''){
                    this.$store.commit('tips/show', this.lang[this.local].enterName);
                    return false
                };
                // if(this.param.username.length != 11){
                //     this.$store.commit('tips/show', this.lang[this.local].phoneError);
                //     return false
                // };
                return true;
            },

            passwordFocus (){
                // this.$store.commit('tips/hide', this.lang[this.local].passwordEmpty);
            },

            passwordBlur (){
                // if(/^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$/g.test(this.param.password)){
                //     this.$store.commit('tips/hide', this.lang[this.local].password);
                //     return true;
                // };
                if(this.param.password == ''){
                    this.$store.commit('tips/show', this.lang[this.local].passwordEmpty);
                    return false;
                };
                return true;
            },

            submit (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(!this.usernameBlur()){
                    return false;
                };
                if(!this.passwordBlur()){
                    return false;
                };

                this.getState = this.getStateStart;
                this.axios({
                    url : this.api.login,
                    data : {
                        ...this.param,
                        email:this.param.username
                    }
                }).then((res) => {
                    // this.getState = this.getStateSuccess;
                    this.$store.commit('tips/add', {
                        text : this.lang[this.local].loginSuccess,
                        status : true,
                        time : this.verifTipTime,
                        el : ".login-btn",
                    });
                    if(this.$route.query && this.$route.query.origin){
                        if(this.$route.query.origin.indexOf('login') == -1){
                            location.href = this.$route.query.origin
                        }else{
                            location.href = '/';
                        }
                    }else{
                        location.href = '/';
                    }

                }).catch((err) => {
                    this.getState = this.getStateError;
                    if(err.code == this.apiStatus.gacode){
                        this.gacodeStatus = this.apiStatus.gacode;
                        this.$store.commit('tips/add', {
                            id : 4009,
                            text : this.lang[this.local]['4009'],
                            status : true,
                            time : this.verifTipTime,
                            el : "[name=login-gacode]",
                        });
                    }else{
                        this.$store.commit('tips/add', {
                            text : err.message || this.lang[this.local].loginError,
                            status : true,
                            time : this.verifTipTime,
                            el : ".login-btn",
                        });
                    };
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
