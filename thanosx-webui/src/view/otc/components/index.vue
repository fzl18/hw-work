<template>
    <section>
        <section  class="otc-block">
            <h4 class="otc-title">
                <router-link to="/index/cnt/buy" :class="classActive($route.params.type == 'buy')">{{lang.buy}} CNT</router-link>
                <router-link to="/index/cnt/sell" :class="classActive($route.params.type == 'sell')">{{lang.sell}} CNT</router-link>
                <otc-menu />
            </h4>
            <list class="otc-table" :url="api.pendlist" :param="listParam">
                <dl slot="head">
                    <dd>{{lang.shop}} <!--(成单数 | 完成率）--></dd>
                    <dd>{{lang.num}}</dd>
                    <dd>{{lang.price}}</dd>
                    <dd>{{lang.clinchADeal30}}</dd>
                    <dd>{{lang.termsOfPayment}}</dd>
                    <dd>{{lang.operation}}</dd>
                </dl>
                <dl slot="body"  slot-scope="{item}" :key="item.id">
                    <dd>
                        <i class="type2">{{((item.nickname + '') || '').slice(0, 1)}}</i>
                        {{item.nickname}} <!--(214 | 100%)-->
                    </dd>
                    <dd>{{numDecimals(item.amount)}} {{upperCase(item.symbol)}}</dd>
                    <dd>
                        <span class="otc-table-price">
                            <i>{{item.price}}</i> <small>CNY</small> <br/>
                            {{item.minmum}}-{{item.maxmum}}  <small>CNY</small>
                        </span>
                    </dd>
                    <dd>{{item.dealnum}}</dd>
                    <dd>
                        <i class="pay-icon" v-if="item.paytype_bank == 1"></i>
                        <i class="pay-icon aliPay" v-if="item.paytype_alipay == 1"></i>
                        <i class="pay-icon weChat" v-if="item.paytype_wx == 1"></i>
                    </dd>
                    <dd>
                        <a href="javascript:;" @click="ad(item)" class="otc-btn" :class="classActive(item.type == '1')">
                            {{item.type == '1' ? lang.sell : lang.buy}}
                        </a>
                    </dd>
                </dl>
            </list>
        </section>
        <trade @closeTrade="closeTrade" v-if="tradeState" :item="tradeData" />
        <orderDetails v-if="orderDetailsState" @closeDetails="closeDetails" :item="item" :payData="payData" />
    </section>
</template>

<script>
    import trade from './trade'
    export default {
        name: "index",
        components : {trade},
        data (){
            return {
                orderDetailsState : false,
                item : {},
                payData : {},
                tradeState : false,
                tradeData : {},
                upList : 1,
            };
        },
        computed : {
            listParam (){
                return {
                    type : this.$route.params.type == 'sell' ? 1 : 2,
                    coin : this.$route.params.coin,
                    upList : this.upList,
                };
            },
        },
        created (){
            this.checkRoute();
        },
        beforeRouteUpdate (to, from, next){
            next();
            this.checkRoute();
        },
        methods : {
            ad (item){
                if(this.loginInfo.uid && this.loginInfo.uid * 1 > 0){
                    this.tradeState = true;
                    this.tradeData = item
                }else{
                    this.toLogin(location.href);
                };
            },
            checkRoute (){
                if(this.$route.params.coin != 'cnt'){
                    this.$router.push('/index/cnt/' + this.$route.params.type);
                };
                if(this.$route.params.type != 'buy' && this.$route.params.type != 'sell'){
                    this.$router.push('/index/' + this.$route.params.coin + '/buy');
                };
            },
            closeDetails (){
                this.orderDetailsState = false;
                this.$router.push('/order');
            },
            closeTrade (data){
                this.tradeState = false;
                if(data){
                    this.item = data.order ||{};
                    this.payData = data;
                    this.orderDetailsState = true;
                    this.upList  = this.upList + 1;
                };
            },
        }
    }
</script>

<style scoped>

</style>
