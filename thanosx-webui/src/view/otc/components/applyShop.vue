<template>
    <section class="otc-block">
        <h4 class="otc-title">
            <span>{{lang.applyShop}}</span>
            <otc-menu />
        </h4>
        <ul class="apply-shop-flow">
            <li class="active">
                <i>1</i>
                <span>{{lang.otc46}}</span>
            </li>
            <li>
                <i>2</i>
                <span>{{lang.otc47}}</span>
            </li>
            <li>
                <i>3</i>
                <span>{{lang.otc48}}</span>
            </li>
            <li>
                <i>4</i>
                <span>{{lang.otc49}}</span>
            </li>
        </ul>
        <div class="apply-shop-text" v-html="lang.applyShopText">
        </div>
        <button type="button" class="apply-shop-btn" @click="cpmState = true">{{lang.applyShop}}</button>
        <section class="otc-trade" v-if="cpmState">
            <section class="otc-trade-box">
                <h4>{{lang.applyShop}} <span class="close" @click="cpmState = false"></span></h4>
                <dl>
                    <dt>CNT {{lang.balance}}</dt>
                    <dd><b>{{shopCoin.xnb}}</b> <small>CNT</small></dd>
                </dl>
                <dl>
                    <dt>{{lang.otc50}}</dt>
                    <dd>
                        <input type="text" v-model="nickname" :placeholder="lang.otc50 " />
                    </dd>
                </dl>
                <dl>
                    <dt>{{lang.margin}}</dt>
                    <dd>
                        <input type="text" v-model="deposit" :placeholder="lang.margin " />
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <a href="javascript:;" @click="apply" class="trade-btn">{{lang.confirm}}{{getStateText()}}</a>
                    </dd>
                </dl>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "applyShop",
        data (){
            return {
                cpmState : false,
                nickname : '',
                deposit : '',
            }
        },
        created (){
            if(this.loginInfo.uid == '' || this.loginInfo.uid * 1 <= 0){
                this.toLogin();
            };
        },
        watch : {
            deposit (n, o){
                var d = n.replace(/[^0-9]*/g, '');
                if(d * 1 > this.shopCoin.xnb){
                    this.deposit = Math.floor(this.shopCoin.xnb) + '';
                }else{
                    this.deposit = d + '';
                };

            },
            loginInfo (n, o){
                if(n && n.uid){

                }else{
                    this.$router.push('./index');
                };
            }
        },
        methods : {
            apply (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                var {nickname, deposit} = this;
                if(nickname.length <= 0){
                    this.$store.commit('msg/err', this.lang.otc51);
                    return false;
                };
                if(deposit.length <= 0 && deposit * 1 > 0){
                    this.$store.commit('msg/err', this.lang.otc52);
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.apply,
                    data : {
                        nickname, deposit
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.applyShopS);
                    this.$router.push('./shop');
                    this.$store.commit('shopDataUpdate');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.applyShopE);
                    console.log(err);
                });
            },
        }
    }
</script>

<style scoped>

</style>
