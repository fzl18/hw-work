<template>
    <section class="trade-user-entrust trade-user-entrust-media">
        <dl class="head">
            <dd>{{lang[local].entrustTime}}</dd>
            <dd>{{lang[local].tradeType}}</dd>
            <dd>{{lang[local].unitPrice}}</dd>
            <dd>{{lang[local].entrustNum}}</dd>
            <dd>{{lang[local].unsettled}}</dd>
            <dd>{{lang[local].entrustTurnover}}</dd>
            <dd>{{lang[local].totalCurrency}}</dd>
            <dd>{{lang[local].state}}</dd>
            <dd>{{lang[local].operation}}</dd>
        </dl>
        <section v-if="userOrderState">
            <happy-scroll :key="111" color="rgba(255, 255, 255, .3)"
                    resize
                >
            <div class="con">
            <dl v-for="item in userOrder" :key="item[0]">
                <dd>{{localDate(item[1])}}</dd>
                <dd :class="item[2] + 'Color'">{{lang[local][item[2]]}}</dd>
                <dd>{{priceAccuracy(item[3])}}</dd>
                <dd>{{numAccuracy(item[5])}}</dd>
                <dd>{{numAccuracy(item[4])}}</dd>
                <dd>{{numAccuracy(item[5] - item[4])}}</dd>
                <dd>{{priceAccuracy(item[3] * item[5])}}</dd>
                <dd>{{item[6] == 'ing' ? lang[local].orderConduct : ''}}</dd>
                <dd>
                    <a :href="item[0]" @click.prevent="clickWithdrawal(item)">{{lang[local].annul}}{{item[7] ? '...' : ''}}</a>
                </dd>
            </dl>
            </div>
            </happy-scroll>
        </section>
        <load v-if="!userOrderState" />
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "userEntrust",
        data (){
            return {};
        },
        computed : {
            ...mapState(['userOrder', 'userOrderState']),
        },
        methods : {
            clickWithdrawal (item){
                item.push(true);
                this.$store.commit('withdrawal', {
                    order_id : item[0] + ''
                });
            },
        }
    }
</script>

<style scoped>

</style>
