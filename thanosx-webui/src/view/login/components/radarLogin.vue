<template>
    <section class="register">
        <h2 class="login-title">{{lang.radarLoginTitle}}</h2>
        <h4 class="login-vice-title">
            {{lang.registerDes}}
            <router-link to="/register">{{lang.freeRegister}}</router-link>
        </h4>
        <section class="login-form">
            <section class="login-form-group">
                <input type="text"  @keyup.enter="submit"  v-model="param.username" name="radar-mobile" :placeholder="lang.enterName" />
            </section>

            <section class="login-form-group">
                <input class="register-paw"  @keyup.enter="submit"  type="password" v-model="param.password" name="radar-password" :placeholder="lang.loginPassword" />
            </section>

            <section class="login-form-group" v-if="gacodeStatus == this.apiStatus.gacode">
                <input class="register-paw"  @keyup.enter="submit"  type="password" v-model="param.gacode" name="radar-gacode" :placeholder="lang['4009']" />
            </section>

            <section class="login-form-group login-form-group-margin2">
            </section>

            <section class="login-form-group login-form-group-margin2">
                <a href="javascript:;" @click="submit" class="login-btn-red">{{lang.login2}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
            </section>

            <section class="login-form-group">
                <router-link to="/login" class="login-btn-white">{{lang.cancel}}</router-link>
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
                if(n){
                    this.$store.commit('tips/hide', this.lang.enterName);
                }
                // if(n.length > 11) {
                //     this.param.username = o;
                //     return;
                // };
                //
                // this.param.username = n.replace(/[^0-9]*/g, '');
                //
                // if(this.param.username.length > 0){
                //     this.$store.commit('tips/hide', this.lang.enterPhone);
                // };
                //
                // if(this.param.username.length == 11){
                //     this.$store.commit('tips/hide', this.lang.phoneError);
                // };
            },
            "param.password" (n, o){
                if(n){
                    this.$store.commit('tips/hide', this.lang.passwordEmpty);
                }
                // this.param.password = n.replace(/[^0-9a-zA-Z\.\\\/\(\)\_\-\+\=\~\!\@\#\$\%\^\&\*\?\'\<\>]*/g, '');
                // if(/^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$/g.test(this.param.password)){
                //     this.$store.commit('tips/hide', this.lang.password);
                // };
            },
        },
        mounted (){
            this.$store.commit('tips/add', {
                text : this.lang.enterName,
                el : "[name='radar-mobile']",
                status : false,
            });

            // this.$store.commit('tips/add', {
            //     text : this.lang.phoneError,
            //     el : "[name='login-mobile']",
            //     status : false,
            // });

            this.$store.commit('tips/add', {
                text : this.lang.passwordEmpty,
                el : "[name=radar-password]",
                status : false,
            });
        },
        methods : {

            getPasswordStatus (){
                // return this.$store.getters['tips/tip']['registerPasTip'].tipsData || {};
            },

            usernameFocus (){
                // if(!this.usernameBlur()){
                //     this.$store.commit('tips/hide', this.lang.password);
                // };
                // this.$store.commit('tips/hide', this.lang.enterPhone);
            },

            usernameBlur (){
                // if(this.param.username == ''){
                //     this.$store.commit('tips/show', this.lang.enterPhone);
                //     return false
                // };
                // if(this.param.username.length != 11){
                //     this.$store.commit('tips/show', this.lang.phoneError);
                //     return false
                // };
                // return true;
            },

            passwordFocus (){
                // this.$store.commit('tips/hide', this.lang.password);
            },

            passwordBlur (){
                // if(/^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$/g.test(this.param.password)){
                //     this.$store.commit('tips/hide', this.lang.password);
                //     return true;
                // };
                // this.$store.commit('tips/show', this.lang.password);
                // return false;
            },

            submit (){
                if(this.getState == this.getStateStart){
                    return false;
                };

                if(!this.param.username){
                    this.$store.commit('tips/show', this.lang.enterName);
                    return false;
                };

                if(!this.param.password){
                    this.$store.commit('tips/show', this.lang.passwordEmpty);
                    return false;
                };
                this.getState = this.getStateStart;
                this.axios({
                    url : this.api.radarLogin,
                    data : {
                        ...this.param
                    }
                }).then((res) => {
                    this.getState = this.getStateSuccess;
                    this.$store.commit('tips/add', {
                        text : this.lang.loginSuccess,
                        status : true,
                        time : this.verifTipTime,
                        el : ".login-btn-red",
                    });
                    location.href = this.$route.query.origin ? this.$route.query.origin : '/';
                }).catch((err) => {
                    this.getState = this.getStateError;
                    if(err.code == this.apiStatus.gacode){
                        this.gacodeStatus = this.apiStatus.gacode;
                        this.$store.commit('tips/add', {
                            id : 4009,
                            text : this.lang['4009'],
                            status : true,
                            time : this.verifTipTime,
                            el : "[name=radar-gacode]",
                        });
                    }else{
                        this.$store.commit('tips/add', {
                            text : err.message || this.lang.loginError,
                            status : true,
                            time : this.verifTipTime,
                            el : ".login-btn-red",
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
