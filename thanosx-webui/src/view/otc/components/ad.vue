<template>
    <section class="otc-trade">
        <section class="otc-trade-box otc-ad-box">
            <h4>{{lang.advertising}} <span class="close" @click="$emit('closeAd')"></span></h4>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.currency}}</dt>
                <dd><b>{{upperCase(symbol)}}</b></dd>
            </dl>
            <dl  v-if="type == 2">
                <dt>{{lang.otcTrade}}{{lang.balance}}</dt>
                <dd><b>{{xnb}}</b> <small>CNT</small></dd>
            </dl>
            <dl v-if="type == 1">
                <dt>{{lang.margin}}</dt>
                <dd><b>{{rmbDecimals(shopData.deposit)}}</b> <small>CNY</small></dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.type}}</dt>
                <dd>
                    <select-my v-model="type" :list="[['1', lang.buy], ['2', lang.sell]]" :selected="type"></select-my>
                </dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.price}}</dt>
                <dd><b>{{type == 2 ? price = 1 : price = 0.99}}</b> <small>CNY</small></dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.num}}</dt>
                <dd>
                    <input type="text" v-model="amount" @blur="amount * 1 < minAmount ? amount = minAmount : ''" :placeholder="lang.otcTrade +  lang.num" />
                </dd>
                <dd v-if="type == 2">
                    {{lang.otc1}}
                </dd>
                <dd v-if="type == 1">
                    {{lang.otc2}}
                </dd>
            </dl>
            <dl>
                <dt>{{lang.termsOfPayment}}</dt>
                <dd>
                    <label>
                        <input v-model="paytype_bank" type="checkbox" />
                        <span>{{lang.bankCard}}</span>
                    </label>
                    <label>
                        <input v-model="paytype_alipay" type="checkbox" />
                        <span>{{lang.aliPay}}</span>
                    </label>
                    <label>
                        <input v-model="paytype_wx" type="checkbox" />
                        <span>{{lang.weChat}}</span>
                    </label>
                </dd>
            </dl>
            <dl>
                <dt>{{lang.otc5}}</dt>
                <dd>
                    <input type="text" v-model="minmum" :placeholder="lang.otc6" />
                </dd>
                <dd>
                    {{lang.default}}{{minmumDefault}} CNY
                </dd>
            </dl>
            <dl>
                <dt>{{lang.otc7}}</dt>
                <dd>
                    <input type="text" v-model="maxmum" @blur="maxmum == '' ? '' : minmum && maxmum * 1 < minmum ? maxmum = minmum : maxmum * 1 < minmumDefault ? maxmum = minmumDefault : ''" :placeholder="lang.otc8" />
                </dd>
                <dd>
                    {{lang.otc9}}
                </dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.total}}</dt>
                <dd><span>{{totalPrice}}</span> <small>CNY</small></dd>
            </dl>
            <dl>
                <dt></dt>
                <dd>
                    <a :href="api.upPend" @click.prevent="upPend" class="trade-btn">{{lang.publish}}{{getStateText()}}</a>
                </dd>
            </dl>
        </section>
    </section>
</template>

<script>
    export default {
        name: "ad",
        data (){
            return {
                symbol : 'cnt',
                type : 2,
                price : 0.99,
                amount : '',
                minAmount : '',
                paytype_bank : '',
                paytype_wx : '',
                paytype_alipay : '',
                maxmumDefault : '',
                maxmum : '',
                minmumDefault : '100',
                minmum : '',
            };
        },
        watch : {
            minmum (n, o){
                n = (n + '').replace(/[^0-9]*/g, "");
                if(n == ''){
                    this.minmum = n;
                    return;
                };
                n = n * 1;
                n = this.maxmum && n > this.maxmum ? this.maxmum : n > this.maxmumDefault ? this.maxmumDefault : n;
                this.minmum = Math.floor(n) + '';
            },
            maxmum (n, o){
                n = (n + '').replace(/[^0-9]*/g, "");
                if(n == ''){
                    this.maxmum = n;
                    return;
                };
                n = n * 1;
                n = n > this.maxmumDefault ? this.maxmumDefault : n;
                this.maxmum = Math.floor(n) + '';
            },
            amount (n, o){
                n = (n + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".");
                if(n == ''){
                    this.amount = n;
                    return;
                };
                n = n * 1;
                n = n > this.xnb ? this.xnb : n;
                this.amount = n + '';
                if(this.price && this.maxmum){
                    this.maxmum = (this.amount * this.price) || 0;
                };
            },
            shopCoin (n, o){
                this.priceChange();
            },
            price (n, o){
                this.priceChange();
                if(this.maxmum){
                    this.maxmum = this.maxmum * 1;
                };
                if(this.amount){
                    this.amount = this.amount < this.minAmount ? this.minAmount : this.amount;
                };
            },
        },
        computed : {
            xnb (){
                if(this.type == 1){
                    return this.numDecimals(this.shopData.deposit*1 / this.price) || 0;
                }else{
                    return this.numDecimals(this.shopCoin.xnb) || 0;
                };
            },
            totalPrice (){
                var xnb = this.xnb * 1;
                return this.toDecimals(this.price * (this.amount || xnb), 6);
            }
        },
        created (){
            this.priceChange();
            // if(this.xnb * 1 <= this.minmumDefault){
            //     this.$store.commit('msg/err', this.lang.otc4 + this.minmumDefault);
            //     this.$emit('closeAd');
            // };
        },
        methods : {
            priceChange (){
                if(this.type == 1){
                    this.maxmumDefault = (this.shopData.deposit || 0) * 1;
                }else{
                    this.maxmumDefault = this.xnb * this.price || 0;
                };
                this.minAmount = Math.ceil(this.minmumDefault / this.price);
            },
            upPend (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                var {symbol, type, price, amount, paytype_bank, paytype_wx, paytype_alipay, minmum, maxmum, minmumDefault, maxmumDefault} = this;

                if(!paytype_bank && !paytype_wx && !paytype_alipay){
                    this.$store.commit('msg/add', this.lang.otc3);
                    return;
                };


                minmum = minmum || minmumDefault;
                maxmum = maxmum || maxmumDefault;
                amount = amount || this.xnb;
                paytype_bank = paytype_bank * 1;
                paytype_alipay = paytype_alipay * 1;
                paytype_wx = paytype_wx * 1;

                if(this.totalPrice < minmum){
                    this.$store.commit('msg/add', this.lang.otc59);
                    return;
                };

                this.getStart();
                this.axios({
                    url : this.api.upPend,
                    data : {
                        symbol, type, price, amount, paytype_bank, paytype_wx, paytype_alipay, minmum, maxmum
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.advertisingS);
                    this.$store.commit('shopDataUpdate');
                    this.$emit('closeAd');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.advertisingE);
                    console.log(err);
                });
            },
        },
    }
</script>

<style scoped>

</style>
