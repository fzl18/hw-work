<template>
    <section class="entrust-box">
        <dl class="entrust-head">
            <dd></dd>
            <dd>{{lang[local].unitPrice}}({{upperCase(rmb)}})</dd>
            <dd>{{lang[local].num}}({{upperCase(xnb)}})</dd>
            <dd>{{lang[local].total}}({{upperCase(rmb)}})</dd>
        </dl>
        <section class="entrust-main">
            <section class="entrust-sell entrust-body">
                <dl v-for="(item, index) in depthSell" :key="item[0]" @click="clickItem('sell', item)">
                    <dd class="sellColor">{{lang[local].depthSell}}{{index + 1}}</dd>
                    <dd class="sellColor">{{priceAccuracy(item[0])}}</dd>
                    <dd>{{numAccuracy(item[1])}}</dd>
                    <dd>{{priceAccuracy(item[0] * item[1])}}</dd>
                </dl>
                <load v-if="!depthState" class="trade-load" />
            </section>
            <!-- <section class="entrust-middle">
                <span>
                    <b>{{priceAccuracy(nowPrice[2])}} {{rmb}}</b><small v-if="rmb != 'cnt'"> ≈ {{priceAccuracy(market_quote[7]) || 0}}CNT</small>
                </span>
                <div class="netState" :class="'type-' + netState" :title="netStateTitle">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </section> -->
            <section class="entrust-buy entrust-body">
                <dl v-for="(item, index) in depthBuy" :key="item[0]" @click="clickItem('buy', item)">
                    <dd class="buyColor">{{lang[local].depthBuy}}{{index + 1}}</dd>
                    <dd class="buyColor">{{priceAccuracy(item[0])}}</dd>
                    <dd>{{numAccuracy(item[1])}}</dd>
                    <dd>{{priceAccuracy(item[0] * item[1])}}</dd>
                </dl>
                <load v-if="!depthState" class="trade-load" />
            </section>
        </section>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "depth",
        data (){
            return {
            };
        },
        computed : {
            ...mapState(['depthSell', 'depthBuy', 'depthState', 'nowPrice', 'market_quote', 'netState', 'netStateTitle']),
        },
        watch : {
        },
        created (){
        },
        methods : {
            clickItem (type, item){
                this.$store.commit('clickData', [type].concat(item));
            },
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/var.scss";
    $entrustMiddleH : 36px;
    .entrust-box{
        position: relative;
        width: 50%;
        height: 100%;
        float: left;
        background: #2C2C2C;
        .entrust-main{
            position: absolute;
            top: $tradeHeadH;
            width: 100%;
            bottom: 0;
            left: 0;
        }
        dl{
            display: block;
            overflow: hidden;
            dd{
                display: block;
                float: left;
                overflow: hidden;
                &:nth-child(1){
                    width: 10%;
                    text-align: center;
                }
                &:nth-child(2){
                    width: 30%;
                    text-align: center;
                    padding-right: 5px;
                }
                &:nth-child(3){
                    width: 30%;
                    text-align: right;
                    padding-right: 5px;
                }
                &:nth-child(4){
                    width: 30%;
                    text-align: right;
                    padding-right: 5px;
                }
                @media screen and (max-width: $tradeMedia1){
                    &:nth-child(1){
                        width: 16%;
                    }
                    &:nth-child(2){
                        width: 42%;
                    }
                    &:nth-child(3){
                        width: 42%;
                    }
                    &:nth-child(4){
                        display: none;
                    }
                }
            }
            &.entrust-head{
                // border-bottom: solid 1px $tradeBorderColor;
                background: #313131;
                color: #7d7d7d;
                text-align: center;
                height: $tradeHeadH;
                line-height: $tradeHeadH;
                dd{
                    height: 100%;
                }
            }
        }
        .entrust-body{
            overflow: auto;
            @include scroll1;
            dl{
                cursor: pointer;
                &:hover{
                    background: $tradeMainColor;
                }
                dd{
                    font-size: 12px;
                    color: #ffffff;
                    height: 24px;
                    line-height: 24px;
                    overflow: hidden;
                    text-align: right;
                }
            }
        }
    }
    $mH : 5px;
    .entrust-middle{
        position: absolute;
        z-index: 100;
        background: $tradeMainColor;
        width: 100%;
        height: $entrustMiddleH;
        line-height: $entrustMiddleH;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        span{
            color: #ffffff;
            text-transform: uppercase;
            font-size: 16px;
            b{
                font-weight: normal;
            }
        }
    }
    .entrust-sell{
        position: absolute;
        z-index: 1;
        height: 50%;
        top: $mH;
        width: 100%;
        left: 0px;
        padding-top: $entrustMiddleH / 2  + $mH;
        transform: rotateX(180deg);
        transform-origin: 50% 50%;
        dl{
            transform: rotateX(-180deg);
        }
    }
    .entrust-buy{
        z-index: 1;
        position: absolute;
        height: 50%;
        padding-top: $entrustMiddleH / 2 + $mH;
        bottom: $mH;
        left: 0px;
        width: 100%;
    }

    .netState{
        display: block;
        position: absolute;
        right: 15px;
        cursor: pointer;
        top: 50%;
        transform: translateY(-50%);
        span{
            display: block;
            float: left;
            margin-right: 3px;
            width: 5px;
            height: 20px;
            background: #24b36b;
            transition: all 0.6s;
            &:nth-child(1){
                height: 8px;
                margin-top: 12px;
            }
            &:nth-child(2){
                height: 12px;
                margin-top: 8px;
            }
            &:nth-child(3){
                height: 16px;
                margin-top: 4px;
            }
            &:nth-child(4){
                height: 20px;
                margin-top: 0px;
            }
        }
        &.type-2{
            span{
                background: #24b36b8f;
                &:nth-child(4),&:nth-child(3){
                    background: #ccc!important;
                }
            }
        }
        &.type-3{
            span{
                background: #E08F00;
                &:nth-child(4),&:nth-child(3){
                    background: #ccc!important;
                }
            }
        }
        &.type-4{
            span{
                background: #f25c49;
                &:nth-child(4),&:nth-child(3),&:nth-child(2){
                    background: #ccc!important;
                }
            }
        }
        &.type-5{
            span{
                &:nth-child(4),&:nth-child(3),&:nth-child(2),&:nth-child(1){
                    background: #ccc!important;
                }
            }
        }
    }
</style>
