<template>
    <section class="otc-trade">
        <section class="otc-trade-box">
            <h4>{{item.type == '1' ? lang.sell : lang.buy}} {{upperCase(item.symbol)}} <span class="close" @click="$emit('closeTrade')"></span></h4>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.price}}</dt>
                <dd><b>{{item.price}}</b> <small>CNY</small></dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.num}}</dt>
                <dd><b class="mainColor">{{numDecimals(item.amount)}}</b> <small>{{upperCase(item.symbol)}}</small></dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.limit}}</dt>
                <dd><b>{{item.minmum}}~{{item.maxmum}}</b> <small>CNY</small></dd>
            </dl>
            <dl>
                <dt>{{item.type == '1' ? lang.sell : lang.buy}}{{lang.num}}</dt>
                <dd>
                    <!-- @blur="num * 1 < item.minmum ? num=item.minmum : ''" -->
                    <input type="text" v-model="num" :placeholder="lang.buy + lang.num" />
                </dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.total}}</dt>
                <dd><span>{{totalPrice}}</span> <small>CNY</small></dd>
            </dl>
            <dl>
                <dd>
                    <a @click="upTrade" href="javascript:;" class="trade-btn">
                        {{item.type == '1' ? lang.sell : lang.buy}}{{getStateText()}}
                    </a>
                </dd>
            </dl>
        </section>
    </section>
</template>

<script>
    export default {
        name: "trade",
        props : ['item'],
        data (){
            return {
                num : '',
            };
        },
        watch : {
            num (n, o){
                n = (n + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".");
                if(n == ''){
                    this.num = n;
                    return;
                };
                n = n * 1;
                n = n > this.item.maxmum ? this.item.maxmum : n;
                this.num = n + '';
            }
        },
        computed : {
            totalPrice (){
                var price = this.item.price * 1;
                return this.toDecimals(price * this.num, 6);
            }
        },
        created (){

        },
        methods : {
            upTrade (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(!this.num){
                    this.$store.commit('msg/err', this.lang.otc25);
                    return false;
                }
                if(this.num * 1 * this.item.price < this.item.minmum*1){
                    this.$store.commit('msg/err', this.lang.otc5 + this.item.minmum + ' CNY');
                    return false;
                }
                this.getStart();
                this.axios({
                    url : this.api.upTrade,
                    data : {
                        id : this.item.id,
                        type : this.item.type == 1 ? 2 : 1,
                        num : this.num,
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.otc26);
                    this.$store.commit('shopDataUpdate');
                    this.$emit('closeTrade', res.data);
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.otc27);
                    console.log(err);
                });
            },
        },
    }
</script>
