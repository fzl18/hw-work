
<template>
    <div class="login">
        <h1 style="text-align:center">{{Lang[useLang].title + Lang[useLang].login}}</h1>
            <Row style="margin:20px;">
                <Col>
                    <Input v-model="address" size="large" style="width:400px;margin:15px auto">
                        <span slot="prepend"> <Icon size="large" type="md-pin" /> 地址：</span>
                    </Input>
                </Col>
                <Col>
                    <Input v-model="secret" size="large" style="width:400px;margin:15px auto" >
                        <span slot="prepend"> <Icon type="md-key" size="large"/> 密钥：</span>
                    </Input>
                </Col>
                <Col span="10" style="margin-top:50px"><Button type="success" size="large" long @click="createAddress">  生成地址 </Button></Col>
                <Col span="10" offset="4" style="margin-top:50px"><Button type="info" size="large" style="float:right" long @click="login"> 登录 </Button></Col>
            </Row>
        <div class="copyright">{{Lang[useLang].copyright}}</div>
    </div>
</template>
<script>
 
export default {
    name:'Login',

    data: function () {
        return {                
            address:'6GiohV7XVhabbtV1DfKjWEyikeyimiDSNx',
            secret:'ssaWWHNnYyU4R8WdSzD8XFCNxKyYc'
        }
    },
    mounted(){
        
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
                this.$Message.error('地址密钥最少填一项')
                return false
            }

            const api = this.chainAPI
            //只输入地址
            if (this.address != '' && this.secret == '') {
                const isAddress = api.isValidAddress(this.address)
                if (isAddress.wallet === false) {
                    this.$Message.error('无效的地址')
                    return false
                }
            }

            //只输入密钥或者地址密钥都输入
            if ((this.address == '' && this.secret != '') || (this.address != '' && this.secret != '')) {
                try {
                    const checkAddress = api.generateAddress(this.secret) // 根据秘钥获取地址
                    if (checkAddress.wallet.secret != this.secret) {
                        this.$Message.error('错误的密钥') 
                        return false
                    }
                } catch (e) {
                    this.$Message.error('错误的密钥')
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
