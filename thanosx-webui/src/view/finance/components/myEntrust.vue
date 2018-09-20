<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].myEntrust}}</span>
            <section class="query">
                <select-my v-model="order_type" class="query-select" :list="marketType" selected="" @change="" />               
                <!-- &nbsp;&nbsp;
                <input type="text" class="coin" v-model="market" />
                <span>/</span>
                <select-my class="query-select coin" v-model="market2" :list="marketList" :selected="market[0]" @change="" :placeholder="lang[local].currency"/> -->
                <!--<a href="javascript:;" class="seek">{{lang.seek}}</a>-->
            </section>
        </financeHeader>
        <list class="myEntrust-table" :url="api.weituo" :param="listParam">
            <dl slot="head">
                <dd style="width:25%">{{lang[local].entrustTime}}</dd>
                <dd style="width:10%">{{lang[local].market}}</dd>
                <dd style="width:10%">{{lang[local].tradeType}}</dd>
                <dd style="width:10%">{{lang[local].unitPrice}}</dd>
                <dd style="width:10%">{{lang[local].entrustNum}}</dd>
                <dd style="width:10%">{{lang[local].entrustTurnover}}</dd>
                <dd style="width:10%">{{lang[local].unsettled}}</dd>
                <dd :title="lang[local].operation" style="width:15%">{{lang[local].operation}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd style="width:25%">{{localDate(item.order_time)}}</dd>
                <dd style="width:10%">{{upperCase(item.market)}}/{{upperCase(item.market2)}}</dd>
                <dd style="width:10%">
                    <span :class="item.order_type == 'Buy' ? 'buyColor' : 'sellColor'">
                        {{item.order_type == 'Buy' ? lang[local].buy : lang[local].sell }}
                    </span>
                </dd>
                <dd style="width:10%">{{tobigNumber(item.price)}}</dd>
                <dd style="width:10%">{{tobigNumber(item.order_count)}}</dd>
                <dd style="width:10%">{{tobigNumber(item.deal)}}</dd>
                <dd style="width:10%">{{tobigNumber(item.count)}}</dd>
                <dd style="width:15%">
                    <a :title="lang[local].annul" href="javascript:;" @click="chexiao(item)">{{lang[local].annul}}{{item.chexiao ? '...' : ''}}</a>
                </dd>
            </dl>
        </list>
    </section>
</template>

<script>
    import bigNum from "bignumber.js"
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
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
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
