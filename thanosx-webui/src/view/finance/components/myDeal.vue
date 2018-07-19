<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].myDeal}}</span>
        </financeHeader>
        <list class="myDeal-table" :url="api.chengjiao" >
            <dl slot="head">
                <dd>{{lang[local].myDeal_OrderTime}} </dd>
                <dd>{{lang[local].myDeal_Asset}}</dd>
                <dd>{{lang[local].myDeal_OrderType}}</dd>
                <dd>{{lang[local].myDeal_Price}}</dd>
                <dd>{{lang[local].myDeal_Count}}</dd>
                <dd>{{lang[local].myDeal_Turnover}}</dd>
                <dd>{{lang[local].myDeal_ServiceCharge}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd>{{localDate(item.timestamp)}}</dd>
                <dd>{{upperCase(item.market)}}/{{upperCase(item.market2)}}</dd>
                <dd><span :class="item.order_type == 'Buy' ? 'buyColor' : 'sellColor'">{{item.order_type == 'Buy' ? lang[local].myDeal_Buy : lang[local].myDeal_Sell}}</span></dd>
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
