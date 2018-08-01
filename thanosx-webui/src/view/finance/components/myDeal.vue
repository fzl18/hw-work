<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].myDeal}}</span>
            <section class="query">
                <select-my v-model="order_type" class="query-select" :list="marketType" selected="" @change="" />               
                &nbsp;&nbsp;
                <input type="text" class="coin" v-model="market" />
                <span>/</span>
                <select-my class="query-select coin" v-model="market2" :list="marketList" :selected="market[0]" @change="" :placeholder="lang[local].currency"/>
                <!--<a href="javascript:;" class="seek">{{lang.seek}}</a>-->
            </section>
        </financeHeader>
        <list class="myDeal-table" :url="api.chengjiao" :param="listParam">
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
                order_type : '',
                market : '',
                market2 : '',
                upData : 1,
                marketList : [],
            }
        },
        computed :{
            marketType (){
                return [['', this.lang[this.local].all],['Buy', this.lang[this.local].sell], ['Sell', this.lang[this.local].buy]];
            },
            listParam (){
                return {
                    order_type : this.order_type || '',
                    market : this.market || '',
                    market2 : this.market2,
                    upData : this.upData,
                };
            }
        },
        created (){
            this.getMarketInfo();
        },
        methods : {
            getMarketInfo (){
                this.axios({
                    url : this.api.getMarketInfo,
                }).then((res) => {
                    this.marketList = res.data.markets;
                }).catch((err) => {
                    console.log(err);
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
