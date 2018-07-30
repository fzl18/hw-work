<template>
    <section class="trade-user-deal trade-user-entrust">
        <dl class="head">
            <dd>{{lang[local].dealTime}}</dd>
            <dd>{{lang[local].myDeal_OrderType}}</dd>
            <dd>{{lang[local].myDeal_Price}}</dd>
            <dd>{{lang[local].tradeVolume}}</dd>
            <dd>{{lang[local].totalCurrency}}</dd>
        </dl>
        <section v-if="userDealState">
            <dl v-for="item in userDeal">
                <dd>{{localDate(item[1])}}</dd>
                <dd :class="item[2] + 'Color'">{{lang[local][item[2]]}}</dd>
                <dd>{{priceAccuracy(item[3])}}</dd>
                <dd>{{numAccuracy(item[4])}}</dd>
                <dd>{{priceAccuracy(item[3] * item[4])}}</dd>
            </dl>
        </section>
        <load v-if="!userDealState" />
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "userDeal",
        computed : {
            ...mapState(['userDeal', 'userDealState']),
        },
    }
</script>

<style scoped>

</style>
