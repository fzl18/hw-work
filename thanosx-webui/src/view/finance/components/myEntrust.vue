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
            <Button size="large" @click="delGroup" type="primary" style="float:right;margin:10px 10px 0 0;padding:8px 25px;font-size:16px;">{{lang[local].c2cacc3}} </Button>
        </financeHeader>
        <list class="myEntrust-table" :url="api.weituo" :param="listParam" @getList="getpageList" :updata="upnum" ref="lt">
            <dl slot="head">
                <dd style="width:5%"><Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll"></Checkbox></dd>
                <dd style="width:20%">{{lang[local].entrustTime}}</dd>
                <dd style="width:10%">{{lang[local].market}}</dd>
                <dd style="width:10%">{{lang[local].tradeType}}</dd>
                <dd style="width:10%">{{lang[local].unitPrice}}</dd>
                <dd style="width:10%">{{lang[local].entrustNum}}</dd>
                <dd style="width:10%">{{lang[local].entrustTurnover}}</dd>
                <dd style="width:10%">{{lang[local].unsettled}}</dd>
                <dd :title="lang[local].operation" style="width:15%">{{lang[local].operation}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <CheckboxGroup v-model="checkGroup" @on-change="checkAllGroupChange">
                    <dd style="width:5%"><Checkbox :label="item.order_id"><span></span></Checkbox></dd>
                    <dd style="width:20%">{{localDate(item.order_time)}}</dd>
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
                </CheckboxGroup>
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
                checkGroup:[],
                checkAll:false,
                indeterminate: false,
                pageList:[],
                upnum:0
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
        watch:{
            upnum (){
                this.$refs.lt.getList()
            }
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
            delGroup(){
                if(this.checkGroup.length == 0){
                    return
                }
                this.axios({
                    url : this.api.chexiao,
                    data : {
                        order_id : this.checkGroup.join()
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', res.message );
                    // this.upnum++
                    setTimeout(()=>{
                        location.reload()
                    },500)
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message);
                });
            },
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    if(this.pageList.length !=0){
                        this.pageList.map(d =>{
                            this.checkGroup.push(d.order_id)
                        })
                        console.log(this.checkGroup);
                        
                    }
                } else {
                    this.checkGroup = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === 10) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            getpageList(val){
                this.pageList = val
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
