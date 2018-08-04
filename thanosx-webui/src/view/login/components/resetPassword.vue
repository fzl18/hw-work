<template>
    <section class="register">
        <h2 class="login-title"><span>{{lang[local].resetPasswordTitle}}</span> {{lang[local].webName}}</h2>
        <section class="login-form">
            <section class="login-form-group" style="z-index: 99999;">
                <!-- <div class="login-state">
                    <select v-model="param.districtcode">
                        <option v-for="v,k in districtCode" :value="v">{{k}}</option>
                    </select>
                    <span :class="classActive(stateCode)" @click="stateCode = !stateCode">
                        {{param.districtcode}}
                    </span>
                    <ul class="login-state-select" v-if="stateCode">
                        <li v-for="v,k in districtCode" @click="stateCode = false;param.districtcode=v"><span>{{v}}</span> <i>{{k}}</i></li>
                    </ul>
                </div> -->
                <div class="login-form-group">
                    <div class="input-box">
                        <i class="iconfont icon-youxiang"></i> <input type="text" @keyup.enter="submit"  v-model="param.username" @focus="usernameFocus" @blur="usernameBlur" name="register-mobile" :placeholder="lang[local].email" />
                    </div>
                </div>
            </section>
            <section class="login-form-group">
                <div class="input-box">
                    <i class="iconfont icon-yanzhengma" style="font-size:18px"></i> <input class="register-code" @keyup.enter="submit" type="text" name="register-moble_verify" @focus="moble_verifyFocus" @blur="moble_verifyBlur" v-model="param.moble_verify" :placeholder="lang[local].emailVerifCode" />
                    <a href="javascript:;" class="login-select register-code-btn active"
                    :class="param.username.length >= 1 && this.verifyCodeTimeText === '' ? 'active' : ''"
                    @click="sendCode"
                    >
                        {{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}
                    </a>
                </div>                
            </section>
            <section class="login-form-group">
                <div class="input-box">
                    <i class="iconfont icon-mima"></i> <input class="register-paw" @keyup.enter="submit" type="password" @blur="passwordBlur" @focus="passwordFocus"  v-model="param.password" name="register-password" :placeholder="lang[local].loginPassword" />
                </div>
            </section>

            <section class="login-form-group">
                <div class="input-box">
                    <i class="iconfont icon-mima"></i> <input class="register-confirm-paw" @keyup.enter="submit" type="password" @blur="passwordConfirmBlur" v-model="param.confirmPassword" name="register-confirmPassword" :placeholder="lang[local].confirmPassword" />
                </div>
            </section>
            <section class="login-form-group">
                <span class="tips">{{lang[local].loginTips}}</span>
            </section>
            <!-- <section class="login-form-group">
                <label class="checkbox-my">
                    <input type="checkbox" v-model="agreement" />
                    <i class="iconfont " :class=" !agreement ? 'icon-huisekuang':'icon-icon2' "></i>
                    {{lang[local].loginAgree}}  <a href="">{{lang[local].PrivacyClause}} </a> & <a href="">{{lang[local].Agreement}} </a> 
                </label> 
            </section> -->
            <section class="login-form-group">
            </section>

            <section class="login-form-group">
                <a href="javascript:;" @click="submit" class="login-btn">{{lang[local].submit}}{{submitStatus ? '...' : ''}}</a>
                <span style="position: absolute;top: 30%;right: 24px;"></span><router-link to="/login" class="login-select"> {{lang[local].inviteLogin}}</router-link>
            </section>
        </section>
        <msg />
    </section>
</template>

<script>
    import registerPasTip from './registerPasTip'
    export default {
        name: "register",
        data (){
            return {
                agreement : false,
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
                    invit : '',
                    districtcode : '+86',
                }
            };
        },
        watch : {
            "param.username" (n, o){
                let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/)           
                // this.param.username = n.replace(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, '');
                if(this.param.username.length > 0){
                    this.$store.commit('tips/hide', this.lang[this.local].enterEmail);
                };
                if(reg.test(this.param.username)){
                    this.$store.commit('tips/hide', this.lang[this.local].emailError);
                };
            },
            "param.moble_verify" (n, o){
                if(n.length > this.verifCodeLen){
                    this.param.moble_verify = o;
                    return;
                };
                // this.param.moble_verify = n.replace(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, '');
                if(this.param.moble_verify.length == 6){
                    this.$store.commit('tips/hide', this.lang[this.local].enterVerifCode);
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
                this.param.password = this.replacePwd(n);
                this.$store.commit('tips/update', {
                    text : 'registerPasTip',
                    status : true,
                    data : this.param.password
                });
            },
            "param.confirmPassword" (n, o){
                if(n == this.param.password){
                    this.$store.commit('tips/hide', this.lang[this.local].passwordConfirm);
                };
            },
            sendCodeCount (n, o){
                if(n > 0){
                    this.$store.commit('tips/hide', this.lang[this.local].sendVerifCode);
                };
            }
        },

        created (){
            // this.getDistrictCode();
            this.param.invit = this.$route.params.invite || ''
        },

        mounted (){
            this.$store.commit('tips/add', {
                text : this.lang[this.local].enterEmail,
                el : "[name='register-mobile']",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[this.local].emailError,
                el : "[name='register-mobile']",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[this.local].enterVerifCode,
                el : "[name='register-moble_verify']",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[this.local].sendVerifCode,
                el : ".register-code-btn",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[this.local].sendVerifCodeError,
                el : ".register-code-btn",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : 'registerPasTip',
                el : "[name=register-password]",
                status : false,
                align : 'left',
                data : this.param.password,
                component : function () {
                    return registerPasTip;
                }
            });

            this.$store.commit('tips/add', {
                text : this.lang[this.local].password,
                el : "[name=register-password]",
                status : false,
            });

            this.$store.commit('tips/add', {
                text : this.lang[this.local].passwordConfirm,
                el : "[name=register-confirmPassword]",
                status : false,
            });
        },

        methods : {
            // getDistrictCode (){
            //     this.axios({
            //         url : this.api.getDistrictCode,
            //     }).then((res) => {
            //         this.districtCode = res.data || {};
            //     }).catch((err) => {
            //         console.log(err);
            //         this.districtCode = {cn : '+86'}
            //     });
            // },
            getPasswordStatus (){
                return this.$store.getters['tips/tip']['registerPasTip'].tipsData || {};
            },

            usernameFocus (){
                this.$store.commit('tips/hide', this.lang[this.local].enterEmail);
            },

            usernameBlur (){
                let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/)    
                if(this.param.username == ''){
                    this.$store.commit('tips/hideAll');
                    this.$store.commit('tips/show', this.lang[this.local].enterEmail);
                    return false
                };
                if(!reg.test(this.param.username)){
                    this.$store.commit('tips/show', this.lang[this.local].emailError);
                    return false
                };
                return true;
            },

            moble_verifyFocus (){
                let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/)  
                this.$store.commit('tips/hide', this.lang[this.local].password);

                this.$store.commit('tips/hide', this.lang[this.local].sendVerifCodeError);

                if(this.param.username == ''){
                    this.$store.commit('tips/show', this.lang[this.local].enterEmail);
                    this.param.moble_verify = '';
                    return false;
                };

                if(!reg.test(this.param.username)){
                    this.$store.commit('tips/show', this.lang[this.local].emailError);
                    this.param.moble_verify = '';
                    return false;
                };

                if(this.sendCodeCount <= 0){
                    this.$store.commit('tips/show', this.lang[this.local].sendVerifCode);
                    this.param.moble_verify = '';
                    return false;
                }
                return true;
            },

            moble_verifyBlur (){
                if(this.sendCodeCount >= 1 && this.param.username.length >= 3 && this.param.username.length <= 32){
                    if(this.param.moble_verify.length == 6){
                        this.$store.commit('tips/hide', this.lang[this.local].enterVerifCode);
                        return true;
                    }else{
                        // this.$store.commit('tips/show', this.lang[this.local].enterVerifCode);
                        return false;
                    };
                };
                return false;
            },

            passwordFocus (){
                this.$store.commit('tips/hide', this.lang[this.local].password);
                this.$store.commit('tips/hide', this.lang[this.local].passwordConfirm);
            },

            passwordBlur (){
                this.$store.commit('tips/hide', 'registerPasTip');
                var passwordStatus = this.getPasswordStatus();
                // if(this.param.password == '' || passwordStatus.type < 2){
                //     this.$store.commit('tips/show', this.lang[this.local].password);
                //     return false;
                // };
                return true;
            },

            passwordConfirmBlur (){
                if(this.param.confirmPassword == '' || this.param.confirmPassword != this.param.password){
                    // this.$store.commit('tips/show', this.lang[this.local].passwordConfirm);
                    return false;
                };
                return true;
            },

            sendCode (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                if(this.param.username == ''){
                    this.$store.commit('tips/show', this.lang[this.local].enterEmail);
                    return false;
                };
                if(this.param.username.length < 3){
                    this.$store.commit('tips/show', this.lang[this.local].emailError);
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.findpwdVerifyCode,
                    data : {
                        email : this.param.username,
                    }
                }).then((res) => {
                    this.sendCodeStatus = true;
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.$store.commit('tips/hide', this.lang[this.local].sendVerifCode);
                    this.$store.commit('tips/add', {
                        text : err.message || this.lang[this.local].sendVerifCodeError,
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
                    this.$store.commit('tips/show', this.lang[this.local].enterVerifCode);
                    return false;
                };

                if(!this.passwordBlur()){
                    this.$store.commit('tips/show', this.lang[this.local].password);
                    return false;
                };

                if(!this.passwordConfirmBlur()){
                    this.$store.commit('tips/show', this.lang[this.local].passwordConfirm);
                    return false;
                };

                // if(!this.agreement){
                //     this.$store.commit('tips/add', {
                //         text : this.lang[this.local].agreementTip + this.lang[this.local].registerAgreement,
                //         status : true,
                //         time : this.verifTipTime,
                //         el : ".checkbox-my",
                //     });
                //     return false;
                // };

                this.submitStatus = true;

                this.axios({
                    url : this.api.findpwd,
                    data : {
                        ...this.param,
                        email:this.param.username,
                        email_verify:this.param.moble_verify
                    }
                }).then((res) => {
                    this.submitStatus = false;
                    this.$store.commit('tips/add', {
                        text : this.lang[this.local].findpwdSuccess,
                        status : true,
                        time : this.verifTipTime,
                        el : ".login-btn",
                    });
                    this.$router.push('/');
                }).catch((err) => {
                    this.submitStatus = false;
                    this.$store.commit('tips/add', {
                        text : err.message || this.lang[this.local].registerError,
                        status : true,
                        time : this.verifTipTime,
                        el : ".login-btn",
                    });
                });
            },

        }
    }
</script>
