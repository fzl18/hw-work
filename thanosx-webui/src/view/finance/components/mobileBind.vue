<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].mobileBind}}</span>
            </financeHeader>

            <section class="safety-form">
                <div class="tit">{{lang[local].mobileBind}}</div>
                <section class="form-group">
                    <div class="login-state input-box">
                        <select v-model="param.districtcode">
                            <option v-for="v,k in districtCode" :value="v">{{k}}</option>
                        </select>
                        <span :class="classActive(stateCode)" @click="stateCode = !stateCode">
                            {{param.country && param.country + '  '}} {{param.districtcode ? param.districtcode :lang[local].selectCountry}}
                        </span>
                        <ul class="login-state-select" v-if="stateCode">
                            <li v-for="v,k in districtCode" @click="stateCode = false;param.districtcode=v ; param.country = k"><span>{{v}}</span> <i>{{k}}</i></li>
                        </ul>
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <i class="iconfont icon-shoujihao"></i> <input type="text" v-model="phone"  @keyup.enter="upmoble" name="safety-upmoble" :placeholder="lang[local].phone" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                       <i class="iconfont icon-yanzhengma"></i> <input type="text" v-model="verify" @keyup.enter="upmoble" name="safety-upmoble-verify" :placeholder="lang[local].SMSVerifCode" />
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
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="upmoble" class="form-submit-btn">{{lang[local].gaCode10}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <a href="javascript: history.go(-1);" class="form-submit-btn white" >{{lang[local].cancel}}</a>
                </section>
            </section>
        </section>
        <msg />
    </section>
</template>

<script>
    export default {
        name: "mobile-bind",
        data (){
            return {
                sendCodeCount : 0,
                phone : '',
                verify : '',
                stateCode:false,
                districtCode : {},
                param : {
                    districtcode : '',
                    country:''
                }
            };
        },
        created (){
            this.getDistrictCode();
        },
        watch:{
            phone (n, o){
                this.phone = n && n.replace(/[^0-9]/g, '');
            },
        },
        methods : {
            getDistrictCode (){
                this.axios({
                    url : this.api.getDistrictCode,
                }).then((res) => {
                    this.districtCode = res.data || {};
                    // this.stateCode = true
                }).catch((err) => {
                    console.log(err);
                    this.districtCode = {cn : '+86'}
                });
            },
            upmoble (){
                if(this.getState == this.getStateStart){
                    return false;
                };

                let mobile = this.phone, verify = this.verify
                if(mobile.length != 11){
                    this.$store.commit('msg/err', this.lang[this.local].phoneError);
                    return false;
                };

                if(this.sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].sendVerifCode);
                    return false;
                };

                if(verify.length != this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode);
                    return false;
                };

                this.getStart();

                this.axios({
                    url : this.api.upmoble,
                    data : {
                        mobile,
                        district_code:this.param.districtcode,
                        mobile_verify:this.verify,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].tradePassword16);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].tradePassword15);
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                if(this.phone.length <7){
                    this.$store.commit('msg/err', this.lang[this.local].phoneError);
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.upmobleVerify,
                    data : {
                        district_code:this.param.districtcode,
                        mobile : this.phone
                    }
                }).then((res) => {                    
                    this.sendCodeCount ++;
                    this.verifyCodeDown('phone');
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message);
                    this.verifyCodeTimeText = '';
                });
            }
        }
    }
</script>

<style scoped lang="scss" >
    @import "../../../assets/css/var.scss";
    .login-state{
        width: 100%;
        & > select{
            display: none;
        }
        & > span{
            cursor: pointer;
            font-size: 16px;
            position: relative;
            line-height: 40px;
            display: block;
            
            &.active{
                &:after{
                    transform:translateY(-50%) rotateZ(180deg);
                }
            }
            &:after{
                content: '\F104';
                @include iconfont(16px);
                display: block;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                transition: transform 0.4s ease;
            }
        }
        .login-state-select{
            position: absolute;
            width: 100%;
            top: 40px - 1px;
            background: #ffffff;            
            box-shadow: 0 0 5px rgba(0,0,0,.3);
            max-height: 200px;
            z-index:999;
            overflow: auto;
            @media screen and (max-width: 820px){
                top: 40px - 1px;
            }
            li{
                display: block;
                padding: 15px 20px;
                font-size: 16px;
                color: $fontColor;
                overflow: hidden;
                cursor: pointer;
                text-transform: uppercase;
                span{
                    float: left;
                }
                i{
                    display: block;
                    float: right;
                    font-style: normal;
                }
                &:nth-child(even){background:#eee;}
            }
        }
    }
    
</style>
