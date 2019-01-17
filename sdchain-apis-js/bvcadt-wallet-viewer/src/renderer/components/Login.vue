
<template>
    <div class="js-count-particles">
        <div id="particles-js" style="height:99vh"></div>
        <div class="layout-logo cc"><img src="../assets/logo.png" alt=""><span>{{Lang[useLang].title}}</span></div>
    <div class="login">
        <Card style="background:#F3F3F3;margin:20px 0">
            <Row style="margin:20px;">
                <Col><h2 style="text-align:center;">{{Lang[useLang].login}}</h2></Col>
                <Col>
                    <Input v-model.trim="address" size="large" style="width:400px;margin:15px auto">
                        <span slot="prepend"> <Icon size="large" type="md-pin" /> {{Lang[useLang].addr}}：</span>
                    </Input>
                </Col>
                <Col>
                    <Input v-model.trim="secret" size="large" style="width:400px;margin:15px auto" >
                        <span slot="prepend"> <Icon type="md-key" size="large"/> {{Lang[useLang].key}}：</span>
                    </Input>
                </Col>
                <Col span="8" offset="3" style="margin-top:50px"><Button type="info" style="background:#21B2B7" size="large" long @click="createAddress">  {{Lang[useLang].createAddress}} </Button></Col>
                <Col span="8" offset="2" style="margin-top:50px"><Button type="primary" size="large" style="float:right" long @click="login"> {{Lang[useLang].login}} </Button></Col>
            </Row>
        </Card>
        <div class="copyright">{{Lang[useLang].copyright}}</div>
    </div>
    </div>
</template>
<script>
import particles from "../assets/particles.json"
export default {
    name:'Login',

    data: function () {
        return {                
            address:'',
            secret:''
        }
    },
    created(){
        require('particles.js')
    },
    mounted(){
        particlesJS("particles-js", particles)
    },
    watch: {

    },
    methods: {
        // 生成新地址
        createAddress() {
            const api = this.chainAPI
            const newAddress = api.generateAddress()
            this.address = newAddress.wallet.address
            this.secret = newAddress.wallet.secret
        },
        // 登陆
        login (){
            if (this.address == '' && this.secret == '') {
                this.$Message.error(this.Lang[this.useLang].errTxt1)
                return false
            }

            const api = this.chainAPI
            //只输入地址
            if (this.address != '' && this.secret == '') {
                const isAddress = api.isValidAddress(this.address)
                if (isAddress.wallet === false) {
                    this.$Message.error(this.Lang[this.useLang].errTxt2)
                    return false
                }
            }

            //只输入密钥或者地址密钥都输入
            if ((this.address == '' && this.secret != '') || (this.address != '' && this.secret != '')) {
                try {
                    const checkAddress = api.generateAddress(this.secret) // 根据秘钥获取地址
                     if (this.address == '') {
                        this.address = checkAddress.wallet.address
                    } else {
                        if (checkAddress.wallet.address != this.address) {
                            this.$Message.error(this.Lang[this.useLang].errTxt3) 
                            return false
                        }
                    }
                } catch (e) {
                    this.$Message.error(this.Lang[this.useLang].errTxt3)
                    return false
                }
            }

            this.$parent.islogin = true
            this.$parent.account = this.address
            this.$parent.secret = this.secret
            this.$parent.logintype = this.secret ? 2 : 1
        }
    },
    
}
</script>
<style>
.layout-logo.cc{float: none;position: absolute;top:5%;left:10%;}
.layout-logo.cc span{
    opacity:.5!important;
    
}
</style>
