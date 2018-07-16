<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang.myDeal}}</span>
        </financeHeader>
        <list class="myDeal-table" :url="api.chengjiao" >
            <dl slot="head">
                <dd>{{lang.myDeal_OrderTime}} </dd>
                <dd>{{lang.myDeal_Asset}}</dd>
                <dd>{{lang.myDeal_OrderType}}</dd>
                <dd>{{lang.myDeal_Price}}</dd>
                <dd>{{lang.myDeal_Count}}</dd>
                <dd>{{lang.myDeal_Turnover}}</dd>
                <dd>{{lang.myDeal_ServiceCharge}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd>{{localDate(item.timestamp)}}</dd>
                <dd>{{upperCase(item.market)}}/{{upperCase(item.market2)}}</dd>
                <dd><span :class="item.order_type == 'Buy' ? 'buyColor' : 'sellColor'">{{item.order_type == 'Buy' ? lang.myDeal_Buy : lang.myDeal_Sell}}</span></dd>
                <dd>{{priceDecimals(item.price)}}</dd>
                <dd>{{numDecimals(item.count)}}</dd>
                <dd>{{priceDecimals(item.price*item.count)}}</dd>
                <dd>{{priceDecimals(item.service)}}</dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "my-deal",
        data (){
            return {
            }
        },
        created (){
        },
        methods : {
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
