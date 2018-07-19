<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].myEntrust}}</span>
            <section class="query">
                <select-my v-model="order_type" class="query-select" :list="marketType" selected="" @change="" />               
            </section>
        </financeHeader>
        <list class="myEntrust-table" :url="api.weituo" :param="listParam">
            <dl slot="head">
                <dd>{{lang[local].entrustTime}}</dd>
                <dd>{{lang[local].market}}</dd>
                <dd>{{lang[local].tradeType}}</dd>
                <dd>{{lang[local].unitPrice}}</dd>
                <dd>{{lang[local].entrustNum}}</dd>
                <dd>{{lang[local].entrustTurnover}}</dd>
                <dd>{{lang[local].unsettled}}</dd>
                <dd>{{lang[local].operation}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd>{{localDate(item.order_time)}}</dd>
                <dd>{{upperCase(item.market)}}/{{upperCase(item.market2)}}</dd>
                <dd>
                    <span :class="item.order_type == 'Buy' ? 'buyColor' : 'sellColor'">
                        {{item.order_type == 'Buy' ? lang[local].buy : lang[local].sell }}
                    </span>
                </dd>
                <dd>{{item.price}}</dd>
                <dd>{{item.order_count}}</dd>
                <dd>{{item.deal}}</dd>
                <dd>{{item.count}}</dd>
                <dd>
                    <a href="javascript:;" @click="chexiao(item)">{{lang[local].annul}}{{item.chexiao ? '...' : ''}}</a>
                </dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "my-entrust",
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
                return [['', this.lang[this.local].all],['Buy', this.lang[this.local].buy], ['Sell', this.lang[this.local].sell]];
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
            chexiao (item){
                item.chexiao = true;
                this.axios({
                    url : this.api.chexiao,
                    data : {
                        order_id : item.order_id
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang[this.local].annulS);
                    this.upData = this.upData + 1;
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].annulE);
                });
            },
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
