<template>
    <section class="otc-menu">
        <router-link to="/index" v-if="$route.name != 'index'">{{lang.buy}}{{lang.sell}}</router-link>
        <router-link to="/order/0/1" v-if="loginInfo && loginInfo.uid && $route.name != 'order'">{{lang.myOrder}}</router-link>
        <router-link to="/shop" v-if="shopData && shopData.nickname && $route.name != 'shop'">{{lang.shopAdmin}}</router-link>
        <router-link to="/applyShop" v-if="loginInfo && loginInfo.uid && shopData && !shopData.nickname && $route.name != 'applyShop'">{{lang.applyShop}}</router-link>
    </section>
</template>

<script>

    import {mapState} from 'vuex'
    export default {
        name: "otc-menu",
        computed : {
            ...mapState(['shopDataUpdate']),
        },
        watch : {
            loginInfo (n, o){
                this.agentDetail();
            },
            shopDataUpdate (n, o){
                this.agentDetail();
                this.myCoin();
            },
        },
        created (){
            this.agentDetail();
            this.myCoin();
        },
        methods : {
            myCoin (){
                this.axios({
                    url : this.api.myCoin,
                    data : {
                        coin : 'cnt'
                    }
                }).then((res) => {
                    this.$store.commit('shopCoin', res.data || {});
                }).catch((err) => {
                    this.$store.commit('shopCoin', {});
                    // console.log(err);
                });
            },
            agentDetail (){
                if(this.loginInfo && this.loginInfo.uid){
                    this.axios({
                        url : this.api.agentDetail,
                        data : {
                            useridAgent : this.loginInfo.uid * 1
                        }
                    }).then((res) => {
                        this.$store.commit('shopData', res.data || {});
                    }).catch((err) => {
                        this.$store.commit('shopData', {});
                        // console.log(err);
                    });
                };
            },
        }
    }
</script>

