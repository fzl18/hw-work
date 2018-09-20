<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].coinRecord}}</span>
        </financeHeader>
        <list class="coinRecord" :url="api.transLog" >
            <dl slot="head">
                <!-- <dd>{{lang[local].coinRecordId}} </dd> -->
                <dd style="width:30%">{{lang[local].coinRecordDate}}</dd>
                <dd style="width:30%">{{lang[local].coinRecordType}}</dd>
                <!-- <dd>{{lang[local].coinRecordObject}}</dd> -->
                <dd style="width:20%">{{lang[local].coinRecordCoin}}</dd>
                <dd style="width:20%">{{lang[local].coinRecordNum}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}" >
                <!-- <dd>{{item.id}}</dd> -->
                <dd style="width:30%">{{localDate(item.time)}}</dd>
                <dd style="width:30%">{{item.type == 1 ? lang[local].takeCoin:item.type == 2 ? lang[local].myDeal_ServiceCharge:item.type == 3 ? lang[local].pushCoin:item.type == 4 ? lang[local].otcTrade : item.type == 5 ?lang[local].icoTrade : item.type == 6 ? lang[local].icoFree1: item.type == 7 ?lang[local].icoFree2 : item.type == 8 ? lang[local].icoFree3 :item.type == 9 ?lang[local].icoFree4:item.type == 10 ?lang[local].icoFree5:lang[local].icoFree6}}</dd>
                <!-- <dd><span class="line-feed">{{item.addr}}</span></dd> -->
                <dd style="width:20%">{{upperCase(item.coin)}}</dd>
                <!-- <dd style="width:20%">{{numDecimals(item.num)}}</dd> -->
                <dd style="width:20%">{{tobigNumber(item.num)}}</dd>
            </dl>
        </list>
    </section>
</template>

<script>
    import bigNum from "bignumber.js"
    export default {
        name: "coinRecord",
        methods : {
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
        },
    }
</script>

