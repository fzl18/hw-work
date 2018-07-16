<template>
    <section>
        <financeHeader>
            <span>{{lang.myPay}}</span>
        </financeHeader>
        <section class="myPay-box">
            <load v-if="getState == getStateStart" />
            <section class="item aliPay" v-if="getState == getStateSuccess">
                <div class="active" v-if="aliPay.account">
                    <div>
                        <i></i>
                        <span @click="deleteAliPay" >{{lang.del}}</span>
                    </div>
                    <ul>
                        <li>{{lang.gu_finance61}}: {{aliPay.account}}</li>
                        <li>{{lang.gu_finance62}}: {{hideName(realName)}}</li>
                    </ul>
                    <img class="ewm" :src="imgUrl(aliPay.paycode)" alt="">
                </div>
                <div class="focus" v-else>
                    <img src="../assets/images/Alipay2.png" alt="">
                    <p>{{lang.gu_finance63}}</p>
                    <router-link to="./addAlipay">{{lang.addAliPay}}</router-link>
                </div>
            </section>
            <section class="item weChat"  v-if="getState == getStateSuccess">
                <div class="active"  v-if="weChat.account">
                    <div>
                        <i></i>
                        <span @click="deleteWeChatPay" >{{lang.del}}</span>
                    </div>
                    <ul>
                        <li>{{lang.gu_finance61}}: {{weChat.account}}</li>
                        <li>{{lang.gu_finance62}}: {{hideName(realName)}}</li>
                    </ul>
                    <img class="ewm" :src="imgUrl(weChat.paycode)" alt="">
                </div>
                <div class="focus" v-else>
                    <img src="../assets/images/WeChat2.png" alt="">
                    <p>{{lang.gu_finance64}}</p>
                    <router-link to="./addWeChat">{{lang.addWeChat}}</router-link>
                </div>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "my-pay",
        data (){
            return {
                aliPay : {
                    account : ''
                },
                weChat : {
                    account : ''
                },
                realName : '',
            }
        },
        created (){
            this.getData();
        },
        methods : {
            deleteAliPay (){
                this.axios({
                    url : this.api.deletepay,
                    data : {
                        type : 'ali',
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang.gu_finance58);
                    this.aliPay.account = '';
                    this.aliPay.paycode = '';
                    this.$router.push('./myPay');
                }).catch((err) => {
                    console.log(err);
                });
            },
            deleteWeChatPay (){
                this.axios({
                    url : this.api.deletepay,
                    data : {
                        type : 'wechat',
                    }
                }).then((res) => {
                    console.log(res.data);
                    this.$store.commit('msg/add', this.lang.delWeChatSuccess);
                    this.weChat.account = '';
                    this.weChat.paycode = '';
                    this.$router.push('./myPay');
                }).catch((err) => {
                    console.log(err);
                });
            },
            getData (){
                this.getStart();
                this.axios({
                    url : this.api.pay,
                }).then((res) => {
                    this.getSuccess();
                    var data = res.data || {};
                    this.weChat.account = res.data.wechatpay;
                    this.weChat.paycode = res.data.wechatpaycode;
                    this.aliPay.account = res.data.alipay;
                    this.aliPay.paycode = res.data.alipaycode;
                    this.realName = res.data.truename;
                }).catch((err) => {
                    this.getError();
                    console.log(err);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
