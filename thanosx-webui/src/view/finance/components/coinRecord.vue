<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang.coinRecord}}</span>
        </financeHeader>
        <list class="coinRecord" :url="api.transLog" >
            <dl slot="head">
                <dd>{{lang.coinRecordId}} </dd>
                <dd>{{lang.coinRecordDate}}</dd>
                <dd>{{lang.coinRecordObject}}</dd>
                <dd>{{lang.coinRecordNum}}/{{lang.coinRecordCoin}}</dd>
                <dd>{{lang.coinRecordType}}</dd>
                <dd>{{lang.coinRecordState}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd>{{item.id}}</dd>
                <dd>{{localDate(item.addtime)}}</dd>
                <dd><span class="line-feed">{{item.addr}}</span></dd>
                <dd>{{numDecimals(item.num)}}/{{upperCase(item.coin)}}</dd>
                <dd>{{item.type}}</dd>
                <dd>{{item.state}}</dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "coinRecord"
    }
</script>

