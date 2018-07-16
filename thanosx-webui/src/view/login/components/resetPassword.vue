<template>
    <section class="register">
        <h2 class="login-title">{{lang[local].resetPasswordTitle}}</h2>
        <h4 class="login-vice-title">
            <router-link to="/login">{{lang[local].inviteLogin}}</router-link>
        </h4>
        <section class="login-form">

            <section class="login-form-group" style="z-index: 99999;">
                <div class="login-state">
                    <select v-model="param.districtcode">
                        <option v-for="v,k in districtCode" :value="v">{{k}}</option>
                    </select>
                    <span :class="classActive(stateCode)" @click="stateCode = !stateCode">
                        {{param.districtcode}}
                    </span>
                    <ul class="login-state-select" v-if="stateCode">
                        <li v-for="v,k in districtCode" @click="stateCode = false;param.districtcode=v"><span>{{v}}</span> <i>{{k}}</i></li>
                    </ul>
                </div>
                <div class="login-mobile">
                    <input type="text"  @keyup.enter="submit"  v-model="param.username" @focus="usernameFocus" @blur="usernameBlur" name="register-mobile" :placeholder="lang[local].phone" />
                </div>
            </section>

            <section class="login-form-group">
                <input class="register-code"  @keyup.enter="submit"  type="text" name="register-moble_verify" @focus="moble_verifyFocus" @blur="moble_verifyBlur" v-model="param.moble_verify" :placeholder="lang[local].SMSVerifCode" />
                <a href="javascript:;" class="register-code-btn"
                   :class="param.username.length >= 7 && this.verifyCodeTimeText === '' ? 'active' : ''"
                   @click="sendCode"
                >
                    {{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}
                </a>
            </section>

            <section class="login-form-group">
                <input class="register-paw"  @keyup.enter="submit"  type="password" @blur="passwordBlur" @focus="passwordFocus"  v-model="param.password" name="register-password" :placeholder="lang[local].loginPassword" />
            </section>

            <section class="login-form-group">
                <input class="register-confirm-paw"  @keyup.enter="submit"  type="password" @blur="passwordConfirmBlur" v-model="param.confirmPassword" name="register-confirmPassword" :placeholder="lang[local].confirmPassword" />
            </section>

            <section class="login-form-group login-form-group-margin2">
            </section>

            <section class="login-form-group">
                <a href="javascript:;" @click="submit" class="login-btn-red">{{lang[local].submit}}{{submitStatus ? '...' : ''}}</a>
            </section>

        </section>
    </section>
</template>

<script>
    import registerPasTip from './registerPasTip'
    export default {
        name: "register",
        data (){
            return {
                agreement : true,
                sendCodeStatus : false,
                sendCodeCount : 0,
                submitStatus : false,
                stateCode : false,
                districtCode : {},
                param : {
                    username : '',
                    moble_verify : '',
                    password : '',
                    confirmPassword : '',
                    districtcode : '+86',
                }
            };
        },
        watch : {
            "param.username" (n, o){
                if(n.length > 11) {
                    this.param.username = o;
                    return;
                };
                this.param.username = n.replace(/[^0-9]*/g, '');
                if(this.param.username.length > 0){
                    this.$store.commit('tips/hide', this.lang[local].enterPhone);
                };
                if(this.param.username.length >= 7){
                    this.$store.commit('tips/hide', this.lang[local].phoneError);
                };
            },
            "param.moble_verify" (n, o){
                if(n.length > this.verifCodeLen){
                    this.param.moble_verify = o;
                    return;
                };
                this.param.moble_verify = n.replace(/[^0-9]*/g, '');
                if(this.param.moble_verify.length == 6){
                    this.$store.commit('tips/hide', this.lang[local].enterVerifCode);
                };
                this.moble_verifyFocus();
            },
            "param.password" (n, o){
                if(n == ''){
                    this.$store.commit('tips/update', {
                        text : 'registerPasTip',
                        status : false,
                        data : this.param.password
                    });
                    return;
                };
                if(n.length > this.passwordMaxLen) {
                    this.param.password = o;
                    this.$store.commit('tips/update', {
                        text : 'registerPasTip',
                        status : true,
                        data : this.param.password
                    });
                    return;
                };
                this.param.password = n.replace(/[^0-9a-zA-Z\.\\\/\(\)\_\-\+\=\~\!\@\#\$\%\^\&\*\?\'\<\>]*/g, '');
                this.$store.commit('tips/update', {
                    text : 'registerPasTip',
                    status : true,
                    data : this.param.password
                });
            },
            "param.confirmPassword" (n, o){
                if(n == this.param.password){
                    this.$store.commit('tips/hide', this.lang[local].passwordConfirm);
                };
            },
            sendCodeCount (n, o){
                if(n > 0){
                    this.$store.commit('tips/hide', this.lang[local].sendVerifCode);
                };
            }
        },

        created (){
            this.getDistrictCode();
        },

        mounted (){

            this.$store.commit('tips/add', {
                text : this.lang[local].enterPhone,
                el : "[name='register-mobile']",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[local].phoneError,
                el : "[name='register-mobile']",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[local].enterVerifCode,
                el : "[name='register-moble_verify']",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[local].sendVerifCode,
                el : ".register-code-btn",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[local].sendVerifCodeError,
                el : ".register-code-btn",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : 'registerPasTip',
                el : "[name=register-password]",
                status : false,
                data : this.param.password,
                align : 'left',
                component : function () {
                    return registerPasTip;
                }
            });

            this.$store.commit('tips/add', {
                text : this.lang[local].password,
                el : "[name=register-password]",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[local].passwordConfirm,
                el : "[name=register-confirmPassword]",
                status : false,
            });
        },

        methods : {
            getDistrictCode (){
                this.axios({
                    url : this.api.getDistrictCode,
                }).then((res) => {
                    this.districtCode = res.data || {};
                }).catch((err) => {
                    console.log(err);
                    this.districtCode = {cn : '+86'}
                });
            },
            getPasswordStatus (){
                return this.$store.getters['tips/tip']['registerPasTip'].tipsData || {};
            },

            usernameFocus (){
                this.$store.commit('tips/hide', this.lang[local].enterPhone);
            },

            usernameBlur (){
                if(this.param.username == ''){
                    this.$store.commit('tips/show', this.lang[local].enterPhone);
                    return false
                };
                if(this.param.username.length < 7){
                    this.$store.commit('tips/show', this.lang[local].phoneError);
                    return false
                };
                return true;
            },

            moble_verifyFocus (){

                this.$store.commit('tips/hide', this.lang[local].password);

                this.$store.commit('tips/hide', this.lang[local].sendVerifCodeError);

                if(this.param.username == ''){
                    this.$store.commit('tips/show', this.lang[local].enterPhone);
                    this.param.moble_verify = '';
                    return false;
                };

                if(this.param.username.length < 7){
                    this.$store.commit('tips/show', this.lang[local].phoneError);
                    this.param.moble_verify = '';
                    return false;
                };

                if(this.sendCodeCount <= 0){
                    this.$store.commit('tips/show', this.lang[local].sendVerifCode);
                    this.param.moble_verify = '';
                    return false;
                }
                return true;
            },

            moble_verifyBlur (){
                if(this.sendCodeCount >= 1 && this.param.username.length >= 7 && this.param.username.length <= 11){
                    if(this.param.moble_verify.length == 6){
                        this.$store.commit('tips/hide', this.lang[local].enterVerifCode);
                        return true;
                    }else{
                        this.$store.commit('tips/show', this.lang[local].enterVerifCode);
                        return false;
                    };
                };
                return false;
            },

            passwordFocus (){
                this.$store.commit('tips/hide', this.lang[local].password);
                this.$store.commit('tips/hide', this.lang[local].passwordConfirm);
            },

            passwordBlur (){
                this.$store.commit('tips/hide', 'registerPasTip');
                var passwordStatus = this.getPasswordStatus();
                if(this.param.password == '' || passwordStatus.type < 2){
                    this.$store.commit('tips/show', this.lang[local].password);
                    return false;
                };
                return true;
            },

            passwordConfirmBlur (){
                if(this.param.confirmPassword == '' || this.param.confirmPassword != this.param.password){
                    this.$store.commit('tips/show', this.lang[local].passwordConfirm);
                    return false;
                };
                return true;
            },

            sendCode (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                if(this.param.username == ''){
                    this.$store.commit('tips/show', this.lang[local].enterPhone);
                    return false;
                };
                if(this.param.username.length  < 7){
                    this.$store.commit('tips/show', this.lang[local].phoneError);
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.findpwdVerifyCode,
                    data : {
                        username : this.param.username,
                        districtcode : this.param.districtcode
                    }
                }).then((res) => {
                    this.sendCodeStatus = true;
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.$store.commit('tips/hide', this.lang[local].sendVerifCode);
                    this.$store.commit('tips/add', {
                        text : err.message || this.lang[local].sendVerifCodeError,
                        status : true,
                        time : this.verifTipTime,
                        el : ".register-code-btn",
                    });
                    this.verifyCodeTimeText = '';
                    this.sendCodeStatus = false;

                });
                return true;
            },

            submit (){
                if(this.submitStatus){
                    return false;
                };
                if(!this.usernameBlur()){
                    return false;
                };
                if(!this.moble_verifyFocus()){
                    return false;
                };
                if(!this.moble_verifyBlur()){
                    return false;
                };
                if(!this.passwordBlur()){
                    return false;
                };
                if(!this.passwordConfirmBlur()){
                    return false;
                };

                this.submitStatus = true;

                this.axios({
                    url : this.api.findpwd,
                    data : {
                        ...this.param
                    }
                }).then((res) => {
                    this.submitStatus = false;
                    this.$store.commit('tips/add', {
                        text : this.lang[local].findpwdSuccess,
                        status : true,
                        time : this.verifTipTime,
                        el : ".login-btn-red",
                    });
                    this.$router.push('/');
                }).catch((err) => {
                    this.submitStatus = false;
                    this.$store.commit('tips/add', {
                        text : err.message || this.lang[local].registerError,
                        status : true,
                        time : this.verifTipTime,
                        el : ".login-btn-red",
                    });
                });
            },

        }
    }
</script>
