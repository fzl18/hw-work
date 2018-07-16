<template>
    <section>
        <section  class="otc-block">
            <h4 class="otc-title">
                <router-link to="/order/0" :class="classActive($route.params.type == 0)">{{lang.orderState0}}</router-link>
                <router-link to="/order/1" :class="classActive($route.params.type == 1)">{{lang.orderState1}}</router-link>
                <router-link to="/order/2" :class="classActive($route.params.type == 2)">{{lang.orderState2}}</router-link>
                <router-link to="/order/4" :class="classActive($route.params.type == 4)">{{lang.orderState4}}</router-link>
                <otc-menu />
            </h4>
            <list class="otc-table order-table" :url="api.orderlist" :param="listParam">
                <dl slot="head">
                    <dd>{{lang.orderId}}</dd>
                    <dd>{{lang.time}}</dd>
                    <dd>{{lang.type}}/{{lang.currency}}</dd>
                    <dd>{{lang.otcTrade}}{{lang.price}}</dd>
                    <dd>{{lang.otcTrade}}{{lang.num}}</dd>
                    <dd>{{lang.otcTrade}}{{lang.object}}</dd>
                    <dd>{{lang.transferNote}}</dd>
                    <dd>{{lang.state}}</dd>
                </dl>
                <dl slot="body"  slot-scope="{item}" :key="item.id">
                    <dd>{{item.id}}</dd>
                    <dd>{{localDate(item.time)}}</dd>
                    <dd :class="item.buyer == loginInfo.uid ? 'buyColor' : 'sellColor'">{{item.buyer == loginInfo.uid ? lang.buy : lang.sell}}/ {{upperCase(item.symbol)}}</dd>
                    <dd>{{rmbDecimals(item.price || (item.pend_type == 1 ? '0.99' : '1'))}}  CNY</dd>
                    <dd>{{numDecimals(item.amount)}}</dd>
                    <dd>{{item.buyer == loginInfo.uid ? item.sellername : item.buyername}}</dd>
                    <dd>{{item.code}}</dd>
                    <dd><a href="javascript:;" @click="details(item)" class="order-btn">{{orderStatusText(item.status)}}</a></dd>
                </dl>
            </list>
        </section>
        <orderDetails v-if="orderDetailsState" @closeDetails="closeDetails" :item="item" />
    </section>
</template>

<script>
    export default {
        name: "order",
        data (){
            return {
                orderDetailsState : false,
                item : {},
                upList : 1,
            };
        },
        watch : {
            loginInfo (n, o){
                if(n && n.uid){

                }else{
                    this.toLogin();
                };
            }
        },
        computed : {
            listParam (){
                return {
                    status : this.$route.params.type || 0,
                    currPage : this.$route.params.page || 1,
                    upList : this.upList
                };
            }
        },
        created (){
            if(this.loginInfo.uid == '' || this.loginInfo.uid * 1 <= 0){
                this.toLogin();
            };
        },
        methods : {
            closeDetails (){
                this.orderDetailsState = false;
                this.upList = this.upList + 1;
            },
            details (item){
                this.item = item;
                this.orderDetailsState = true;
            },
        },
    }
</script>

<style scoped>

</style>
