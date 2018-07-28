<template>
    <section class="trade-buy-box">
        <p class="balance">{{rmb}} {{lang[local].usable}}： {{priceAccuracy(rmbAssets)}}</p>
        <!-- <div class="tit">{{lang[local].buyPrice}}</div> -->
        <section class="inp" :class="classActive(clickActive)">
            <span>{{lang[local].price}}</span> 
            <input type="text" v-model="price" />
            <span class="dw">{{rmb}}</span>
        </section>
        <!-- <div class="tit">{{lang[local].buyNum}}</div> -->
        <section class="inp">
            <span>{{lang[local].num}}</span> 
            <input type="text" v-model="num" />
            <span class="dw">{{xnb}}</span>
        </section>

        <section class="rate" :class="rateType">
            <!-- <div class="rate-bar">
                <span :style="{width : rateText}"></span>
                <span @click="rateBar($event)" class="click-active"></span>
            </div> -->
            <span @click="clickRate(0.25)">25%</span>
            <span @click="clickRate(0.5)">50%</span>
            <span @click="clickRate(0.75)">75%</span>
            <span @click="clickRate(1)">100%</span>
        </section>

        <p class="total"></p>
        <p class="usable">{{lang[local].total}}：{{totalPrice}} {{rmb}} 
            <!-- <span>{{rateText}}</span> -->
        {{lang[local].buyMay}}：{{maxNum}} {{xnb}}</p>
        <p class="nologin" v-if="loginInfo.uid == '' || loginInfo.username == ''">
            <a class="buyColor" :href="loginUrl">{{lang[local].login2}}</a> {{lang[local].tradeLogin2}} <a class="sellColor" :href="registerUrl">{{lang[local].freeRegister}}</a>
        </p>
        <a v-if="loginInfo.uid !== '' || loginInfo.username !== ''" href="javascript:;" class="trade-btn" @click="submit">{{lang[local].buy}} {{xnb}}{{buyData.price ? '...' : ''}}</a>
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
                    this.$store.commit('msg/err', this.lang[this.local].tradePriceEmpty);
                };
            },
            submit : function (){
                if(!!!this.loginInfo.uid){
                    this.$store.commit('msg/err', this.lang[this.local].inviteLogin);
                    return false;
                };
                if(this.buyData.price){
                    return;
                };
                if(this.rmbAssets * 1 <= 0){
                    this.$store.commit('msg/err', this.rmb + this.lang[this.local].balanceEmpty);
                    return false;
                };
                if(!!!this.price){
                    this.$store.commit('msg/err', this.lang[this.local].tradePriceEmpty);
                    return false;
                };
                if(!!!this.num){
                    this.$store.commit('msg/err', this.lang[this.local].tradeNumEmpty);
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
