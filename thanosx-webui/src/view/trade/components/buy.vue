<template>
    <section class="trade-buy-box">
        <p class="balance">{{rmb}} {{lang.usable}}： {{priceAccuracy(rmbAssets)}}</p>
        <section class="inp" :class="classActive(clickActive)">
            <span>{{lang.buyPrice}} ({{rmb}})</span>
            <input type="text" placeholder="0.00" v-model="price" />
        </section>
        <section class="inp">
            <span>{{lang.buyNum}} ({{xnb}})</span>
            <input type="text" placeholder="0.00" v-model="num" />
        </section>

        <section class="rate" :class="rateType">
            <div class="rate-bar">
                <span :style="{width : rateText}"></span>
                <span @click="rateBar($event)" class="click-active"></span>
            </div>
            <span @click="clickRate(0)"></span>
            <span @click="clickRate(0.25)"></span>
            <span @click="clickRate(0.5)"></span>
            <span @click="clickRate(0.75)"></span>
            <span @click="clickRate(1)"></span>
        </section>

        <p class="total">{{lang.total}}：{{totalPrice}} {{rmb}} <span>{{rateText}}</span></p>
        <p class="usable">{{lang.buyMay}}：{{maxNum}} {{xnb}}</p>
        <a href="javascript:;" class="trade-btn" @click="submit">{{lang.buy}} {{xnb}}{{buyData.price ? '...' : ''}}</a>

    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "buy",
        data (){
            return {
                price : '',
                num : '',
                rate : 0,
                maxNum : 0,
                clickActive : false
            };
        },
        watch : {
            price (n, o){
                n = this.decimals(n);
                if(n * 1 >= 0){
                    this.price = this.rmbSplit(n);
                    var maxNum = this.price * 1 > 0 ? this.rmbAssets / (this.serviceCharge + 1) / this.price : 0;
                    this.maxNum= this.numAccuracy(maxNum);
                }else{
                    this.price = '';
                };
            },
            num (n, o){
                n = this.decimals(n);
                if(n * 1 >= 0){
                    if(this.rmbAssets * 1 <= 0){
                        this.num = '';
                    }else{
                        this.num = this.xnbSplit(n);
                    };
                }else{
                    this.num = '';
                };
            },
            clickData (n, o){
                if(n[0] == 'buy'){
                    if(!this.clickActive){
                        setTimeout(() => {
                            this.clickActive = false;
                        }, 1000)
                    };
                    this.clickActive = true;
                };
                this.num = n[2];
                this.price = n[1];
            },
        },
        created (){

        },
        computed : {
            ...mapState(['assets', 'xnbAssets', 'rmbAssets', 'buyData', 'clickData']),
            rateType (){
                return this.rate <= 0 ? '' : this.rate < 0.25 ? 'type-1' : this.rate < 0.5 ? 'type-2' : this.rate < 0.75 ? 'type-3' : this.rate < 1 ? 'type-4' : 'type-5'
            },
            rateText (){
                return this.rate * 1 <= 0 ? 0 + '%' : Math.round(this.rate * 10000) / 100 + '%';
            },
            totalPrice : function (){
                var totalPrice = this.price * this.num;
                var maxTotalPrice = totalPrice * this.serviceCharge + totalPrice;
                if(maxTotalPrice * 1 > this.rmbAssets * 1){
                    var num = this.xnbSplit(this.rmbAssets / (this.serviceCharge + 1) / this.price) || '';
                    this.num = num * 1 <= 0 ? '' : num;
                    totalPrice = (this.num || 0) * this.price;
                    maxTotalPrice = totalPrice * this.serviceCharge + totalPrice;
                };
                this.rate = (this.rmbAssets * 1 <= 0) ? 0 : Math.ceil(totalPrice / (this.rmbAssets / (this.serviceCharge + 1))  * 10000) / 10000;
                return this.rmbSplit(maxTotalPrice);
            },
        },
        methods : {
            rateBar (e){
                var rate = e.layerX / e.target.clientWidth;
                this.clickRate(rate);
            },
            clickRate (rate){
                if(this.price){
                    var num = (this.rmbAssets * rate) / (this.serviceCharge + 1) / this.price;
                    this.num = this.xnbSplit(num);
                }else{
                    this.$store.commit('msg/err', this.lang.tradePriceEmpty);
                };
            },
            submit : function (){
                if(!!!this.loginInfo.uid){
                    this.$store.commit('msg/err', this.lang.inviteLogin);
                    return false;
                };
                if(this.buyData.price){
                    return;
                };
                if(this.rmbAssets * 1 <= 0){
                    this.$store.commit('msg/err', this.rmb + this.lang.balanceEmpty);
                    return false;
                };
                if(!!!this.price){
                    this.$store.commit('msg/err', this.lang.tradePriceEmpty);
                    return false;
                };
                if(!!!this.num){
                    this.$store.commit('msg/err', this.lang.tradeNumEmpty);
                    return false;
                };
                this.$store.commit('buyData', {
                    price : this.price,
                    count : this.num,
                })
            }
        }
    }
</script>
