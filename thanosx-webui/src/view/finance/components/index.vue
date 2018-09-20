<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].myAssets}}</span>
        </financeHeader>
        <!-- <section class="finance-hint" v-if="loginStatus && !loginInfo.truename">
            {{lang[local].nameAuth30}}
        </section> -->
        <section class="amount">
            <span>{{lang[local].totalAssets}}：</span>
            <b class="totalAssets" :class="classActive(!totalAssetsState)"> <span>{{ totalAssets}}</span></b>
            <span style="font-size:13px;padding:3px 10px;display:inline-block;background:#999;color:#fff;line-height:20px;border-radius: 15px;">USDT</span>
        </section>
        <section class="tab_btn">
            <a href="javascript:;" :class="!cur ? 'cur' :'' " @click="hadndleTab(0)">{{lang[local].mainCoin}}</a>
            <a href="javascript:;" :class="cur ? 'cur' :'' " @click="hadndleTab(1)">{{lang[local].newCoin}}</a>
            <div class="filter">
                <span @click=" isChecked = !isChecked "> <i class="iconfont" :class=" isChecked ? 'icon-icon2' : 'icon-huisekuang'"></i> {{lang[local].filter}}</span>
            </div>
        </section>
        <list class="finance-index-table" :url="api.assets" pageSize="100" :pageStatus="false" :seek="seek">
            <dl slot="head">
                <dd>{{lang[local].currency}}</dd>
                <dd>{{lang[local].usable}}</dd>
                <dd>{{lang[local].freeze}}</dd>
                <dd>{{lang[local].lock}}</dd>
                <dd>{{lang[local].totalCurrency}}</dd>
                <dd>{{lang[local].operation}}</dd>
            </dl>            
            <dl slot="body" slot-scope="{item}"  v-if=" !cur ?  mainChain.indexOf(item.market2.toLowerCase()) != -1 : mainChain.indexOf(item.market2.toLowerCase()) == -1" >
                <template v-if=" isChecked ? item.total > 0 : true ">
                <dd>
                    <span>
                        <b>{{upperCase(item.market2)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <!-- <b>{{numDecimals(item.available)}}</b> -->
                        <b>{{tobigNumber(item.available)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{tobigNumber(item.availabled)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{tobigNumber(item.availablelock)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{tobigNumber(item.total)}}</b>
                        <!-- <small>≈¥{{rmbDecimals(item.total_cny)}}</small> -->
                    </span>
                </dd>
                <dd>
                    <router-link :class="item.zr_jz != 1 ? 'disabled' : ''" :to="item.zr_jz != 1 ? '' : './pushCoin?coin=' + item.market2">
                        {{lang[local].pushCoin}}
                    </router-link>
                    <router-link :class="item.zc_jz != 1 ? 'disabled' : ''" :to="item.zc_jz != 1 ? '' : './takeCoin?coin=' + item.market2">
                        {{lang[local].takeCoin}}
                    </router-link>
                    <!-- <router-link :class="upperCase(item.zcother_jz) != 1 ? 'disabled' : ''" :to="upperCase(item.zcother_jz) != 1 ? '' : './transferCoin?coin=' + item.market2">
                        {{lang[local].transferCoin}}
                    </router-link> -->
                </dd>
                </template>
            </dl>
        </list>
    </section>
</template>

<script>
    import bigNum from "bignumber.js"
    export default {
        name: "index",
        data (){
            return {
                mainChain:[],
                isChecked:false,
                cur:0,
                market2 : '',
                totalAssets : 0,
                coinSeekSatet : false,
                totalAssetsState : false,
                origin : process.env.NODE_ENV == 'development' ? 'http://39.108.169.210' : ''
            };
        },
        watch : {
        },
        computed : {
            seek (){
                return {market2 : this.market2};
            },
            // ismain (){
            //     return  this.mainChain.indexOf(this.item.market2) == -1
            // }
            
        },
        created (){
            this.myasset()
            this.getMainCoins()
        },
        mounted(){
            console.log(this.mainChain)
        },
        methods : {
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
            myasset (){
                this.axios({
                    url : this.api.myasset,
                }).then((res) => {
                    this.totalAssets = res.data.tol || 0;
                }).catch((err) => {
                    console.log(err);
                });
            },
            hadndleTab (index){
                this.cur = index
            },
            getMainCoins(){
                this.axios({
                    url : this.api.getMainCoins,
                    data : {
                    }
                }).then(res => {
                    this.mainChain = res.data
                    console.log(res.data)
                }).catch()
            }
        },
    }
</script>

