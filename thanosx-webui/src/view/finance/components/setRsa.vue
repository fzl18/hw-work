<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].setRsaTit}} ({{isbind ? lang[local].safety9 : lang[local].safety10}})</span>
            </financeHeader>
            <div class="tit">{{lang[local].setRsaTxt}}<br/><span v-html="lang[local].setRsaTxt1" /></div>
            <section class="safety-form rsa">
                <section class="form-group">
                    <div class="input-box" style="position: relative;">
                    <input type="text" @keyup.enter="setRsa" style="width:60%"  v-model="emailCode" name="emailCode" :placeholder="lang[local].emailVerifCode" />
                    <a href="javascript:;" class="getCode"
                    @click="sendCode"
                    >
                        {{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}
                    </a>
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <input type="text" @keyup.enter="setRsa"  v-model="gaCode" name="gaCode" :placeholder="lang[local]['4009']" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <textarea rows="5" type="text" @keyup.enter="setRsa"  v-model="rsa" name="rsa" placeholder="RSA" />
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="setRsa" class="form-submit-btn" style="width:100%;">{{lang[local].accbtnbind}}{{this.getState == this.getStateStart ? '...' : ''}}</a>                    
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "setRsa",
        data (){
            return {
                emailCode : '',
                rsa:'',
                gaCode:'',
                isbind:false
            };
        },
        created (){
            this.rsaInfo()
        },
        methods : {
            setRsa (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.emailCode.length < 6){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode);
                    return false;
                };
                if(this.gaCode.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].ga1);
                    return false;
                };                
                this.getStart();
                this.axios({
                    url : this.api.setRsa,
                    data : {
                        ga_code : this.gaCode,
                        rsa_public_key:this.rsa,
                        email_verify:this.emailCode
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].safety15);
                    this.$router.push('/account');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message);
                });
            },
            sendCode(){
                this.axios({
                    url : this.api.getRsaMailCode,
                    data : {
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang[this.local].emailTips)
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message);
                });
            },
            rsaInfo(){
                this.axios({
                    url : this.api.rsaInfo,
                    data : {
                    }
                }).then((res) => {
                    if(res.data.google_is_bind){
                        this.isbind = res.data.rsa_is_bind
                    }else{
                        this.$store.commit('msg/err', this.lang[this.local].setRsaTip)
                        this.$router.push('/ga')
                    }
                }).catch((err) => {
                    console.log(err)
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .tit{
        font-size:16px;padding-left:15px;margin:30px 0;line-height: 30px;
    }
    .rsa{
        width:600px;
        margin:50px 15px;
        border-top:3px solid #FF6500;
        input{width:100%;}
        textarea{
            width: 100%;border:none;padding:10px;font-size:16px;outline:none
        }
        .getCode{
            display:block; position: absolute;right:0;top:20px;color:#FF6500;
        }
    }
</style>
