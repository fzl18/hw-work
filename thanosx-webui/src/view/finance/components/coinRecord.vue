<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].coinRecord}}</span>
        </financeHeader>
        <list class="coinRecord" :url="api.transLog" >
            <dl slot="head">
                <dd>{{lang[local].coinRecordId}} </dd>
                <dd>{{lang[local].coinRecordDate}}</dd>
                <dd>{{lang[local].coinRecordObject}}</dd>
                <dd>{{lang[local].coinRecordNum}}/{{lang[local].coinRecordCoin}}</dd>
                <dd>{{lang[local].coinRecordType}}</dd>
                <dd>{{lang[local].coinRecordState}}</dd>
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

