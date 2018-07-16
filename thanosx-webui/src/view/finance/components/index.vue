<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang.totalAssets}}</span>
            <b class="totalAssets" :class="classActive(!totalAssetsState)">¥ <span>{{!totalAssetsState ? totalAssets : '********'}}</span></b>
            <ul class="finance-index">
                <li :class="classActive(coinSeekSatet)">
                    <input v-model="market2" type="text" />
                    <i @click="coinSeekSatet = !coinSeekSatet"></i>
                </li>
                <li>
                    <router-link :title="lang.coinRecord" to="/coinRecord"><i></i></router-link>
                </li>
                <li>
                    <i :title="lang.hideBalance" @click="totalAssetsState = !totalAssetsState; totalAssetsState ? myasset() : ''"></i>
                </li>
            </ul>
        </financeHeader>
        <section class="finance-hint" v-if="loginStatus && !loginInfo.truename">
            {{lang.nameAuth30}}
        </section>
        <list class="finance-index-table" :url="api.assets" pageSize="100" :pageStatus="false" :seek="seek">
            <dl slot="head">
                <dd>{{lang.currency}}</dd>
                <dd>{{lang.usable}}</dd>
                <dd>{{lang.freeze}}</dd>
                <dd>{{lang.lock}}</dd>
                <dd>{{lang.totalCurrency}}</dd>
                <dd>{{lang.operation}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}">
                <dd>
                    <i :style="{backgroundImage : 'url(' + imgUrl(item.img) + ')'}"></i>
                    <span>
                        <b>{{upperCase(item.market2)}}</b>
                        <small>{{item.market_coin}}</small>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{numDecimals(item.available)}}</b>
                        <small>≈¥{{rmbDecimals(item.available_cny)}}</small>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{numDecimals(item.availabled)}}</b>
                        <small>≈¥{{rmbDecimals(item.availabled_cny)}}</small>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{numDecimals(item.availablelock)}}</b>
                        <small>≈¥{{rmbDecimals(item.availablelock_cny)}}</small>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{numDecimals(item.total)}}</b>
                        <small>≈¥{{rmbDecimals(item.total_cny)}}</small>
                    </span>
                </dd>
                <dd>
                    <router-link :class="item.zr_jz != 1 ? 'disabled' : ''" :to="item.zr_jz != 1 ? '' : './pushCoin?coin=' + item.market2">
                        {{lang.pushCoin}}
                    </router-link>
                    <router-link :class="item.zc_jz != 1 ? 'disabled' : ''" :to="item.zc_jz != 1 ? '' : './takeCoin?coin=' + item.market2">
                        {{lang.takeCoin}}
                    </router-link>
                    <router-link :class="upperCase(item.zcother_jz) != 1 ? 'disabled' : ''" :to="upperCase(item.zcother_jz) != 1 ? '' : './transferCoin?coin=' + item.market2">
                        {{lang.transferCoin}}
                    </router-link>
                </dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "index",
        data (){
            return {
                market2 : '',
                totalAssets : 0,
                coinSeekSatet : false,
                totalAssetsState : false,
                origin : process.env.NODE_ENV == 'development' ? 'http://clt.vroot.win' : ''
            };
        },
        watch : {
        },
        computed : {
            seek (){
                return {market2 : this.market2};
            },
        },
        created (){
            this.myasset();
        },
        methods : {
            myasset (){
                this.axios({
                    url : this.api.myasset,
                }).then((res) => {
                    this.totalAssets = res.data.tol || 0;
                }).catch((err) => {
                    console.log(err);
                });
            },
        },
    }
</script>

