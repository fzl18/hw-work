<template>
    <section class="trade-menu">
        <div class="market-code">
            <span>{{xnb}}/{{rmb}}</span>
            <section class="market-code-list-box">
                <ul class="market-code-list-area">
                    <li v-for="item in markets" :class="classActive(item == selectActive)" @mouseover="selectActive=item">
                        <!-- <i :style="{backgroundImage : 'url(' + imgUrl((coins[item] && coins[item].logo) || '') + ')'}"></i> -->
                        <span>{{item}}</span>
                    </li>
                </ul>
                <div class="market-code-list">
                    <div class="tit" v-if="hasmain"> <span >{{lang[local].mainCoin}}</span></div>
                    <div>
                        <router-link v-for="item in districtInfo && districtInfo[selectActive]" :key="item.xnb + '_' + item.rmb"  :to="'/' + item.xnb + '/' + item.rmb" :class="classActive(item.xnb == xnb && selectActive == rmb)" v-if="mainblock.indexOf(item.xnb) != -1">
                        <!-- <i :style="{backgroundImage : 'url(' + imgUrl((coins[item.xnb] && coins[item.xnb].logo) || '') + ')'}"></i> -->
                        <span>{{item.xnb}}/{{selectActive}}</span>
                        </router-link>
                    </div>
                    
                    <div class="tit" v-if="hasnew"><span> {{lang[local].newCoin}}</span></div>
                    <div>
                        <router-link v-for="item in districtInfo && districtInfo[selectActive]" :key="item.xnb + '_' + item.rmb"  :to="'/' + item.xnb + '/' + item.rmb" :class="classActive(item.xnb == xnb && selectActive == rmb)" v-if="mainblock.indexOf(item.xnb) == -1">
                        <!-- <i :style="{backgroundImage : 'url(' + imgUrl((coins[item.xnb] && coins[item.xnb].logo) || '') + ')'}"></i> -->
                        <span>{{item.xnb}}/{{selectActive}}</span>
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
        <section class="trade-menu-market">
            <span>
                <small>{{lang[local].currentRate}}({{rmb}})</small>
                <b>{{priceAccuracy(market_quote[1]) || '--'}}</b>
            </span>
            <span>
                <small>{{lang[local].dayUpDown}}</small>
                <b :class="market_quote[2] * 1 > 0 ? 'riseColor' : market_quote[2] * 1 < 0 ? 'fallColor' : ''">{{market_quote[2] * 1 > 0 ? '+' : ''}}{{perCentDecimals(market_quote[2]) || 0}} %</b>
            </span>
            <span>
                <small>{{lang[local].topPrice}}({{rmb}})</small>
                <!-- <b>{{priceAccuracy(market_quote[3])}}{{rmb}}</b> -->
                <b>{{market_quote[3] ? priceAccuracy(tobigNumber(market_quote[3])) : '--'}}</b>
            </span>
            <span>
                <small>{{lang[local].minPrice}}({{rmb}})</small>
                <!-- <b>{{priceAccuracy(market_quote[4])}} {{rmb}}</b> -->
                <b>{{market_quote[4] ? priceAccuracy(tobigNumber(market_quote[4])) : '--'}}</b>
            </span>
            <span>
                <small>{{lang[local].tradeVolume}}({{xnb}})</small>
                <b>{{numAccuracy(market_quote[5]) || '--'}}</b>
            </span>
        </section>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    import bigNum from "bignumber.js"
    export default {
        name: "trade-menu",
        data (){
            return {
                selectActive : '',
                mainblock:[],
                list:[]
            }
        },
        created (){
            this.selectActive = this.rmb
            this.getMainCoins()
        },
        mounted(){
            this.list = this.districtInfo && this.districtInfo[this.selectActive]
        },
        computed : {
            hasmain(){
                let num = 0
                // console.log(this.list,this.mainblock)
                this.districtInfo.length && this.districtInfo[this.selectActive].map( d => {                    
                    if(this.mainblock.indexOf(d.xnb) == -1){
                        num ++
                    }
                    // console.log(d.xnb)
                })
                
                return num ? true : false
            },
            hasnew(){
                let num = 0
                this.districtInfo.length && this.districtInfo[this.selectActive].map( d => {                    
                    if(this.mainblock.indexOf(d.xnb) != -1){
                        num ++
                    }                    
                })
                return num ? true : false
            },
            ...mapState(['market_quote']),
        },
        methods:{
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
            getMainCoins(){
                this.axios({
                    url : this.api.getMainCoins,
                    data : {
                    }
                }).then(res => {
                    this.mainblock = res.data
                }).catch()
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .trade-menu{
        height: 50px;
        width: 100%;
        min-width:700px;
        text-transform: uppercase;
        // border-bottom: solid 1px $tradeBorderColor;
        background: #2C2C2C;
        position: relative;
        z-index: 100;
        .market-code{
            width: 18%;
            float: left;
            height: 100%;
            color: #767676;
            font-size: 15px;
            text-align: center;
            position: relative;margin-right:2%;
            // @media screen and (max-width: $tradeMedia1){
            //     width: 24%;
            // }
            & > span{
                height: 100%;
                display: block;
                width: 100%;
                cursor: pointer;
                color:#fff;
                line-height: $tradeMenuH;
                &:after{
                    content: '\F104';
                    display: inline-block;
                    vertical-align: middle;
                    @include iconfont(16px);
                    margin-left: 10px;
                    transition: transform .4s ease-out;
                }
            }
            &:hover{
                background: #383838;
                .market-code-list-box{
                    display: block;                    
                }
                & > span:after{
                    transform: rotateZ(180deg);
                }
            }
            .market-code-list-box{
                display: none;
                border-right: 2px;
                background: #383838;
                position: absolute;
                // left: 20px;
                top: 100%;
                $itemW : 130px;
                .market-code-list-area{
                    display: block;
                    width: 7 * $itemW;
                    padding: 0 15px;
                    height: 65px;
                    border-bottom: 1px dotted #5F5F5F;
                    li{
                        display: block;
                        width: $itemW;
                        float: left;
                        height: 100%;
                        text-align: left;
                        cursor: pointer;
                        position: relative;
                        &.active{
                            color: #fff;
                        }
                        &:before{
                            content: '';
                            display: inline-block;
                            vertical-align: middle;
                            height: 100%;
                        }
                        i{
                            display: inline-block;
                            width: 24px;
                            height: 24px;
                            margin-right: 5px;
                            // background: url("../assets/images/btc.png") no-repeat;
                            background-size: 100% 100%;
                            vertical-align: middle;
                        }
                        span{
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                }
                .market-code-list{
                    padding: 15px 15px;
                    overflow: hidden;
                    font-size: 15px;
                    .tit{
                        span{background: #222;color:#aaa;padding:5px 15px;border-radius:6px;}
                        text-align: left;
                    }
                    div{display:block;overflow: hidden;line-height: 30px;}
                    a{
                        display: block;
                        width: $itemW;
                        float: left;
                        padding: 15px 0;
                        text-align: left;
                        cursor: pointer;
                        color: #767676;
                        border-radius: 2px;
                        margin-bottom: 5px;
                        transition: color 0.3s linear;
                        &:hover,&.active{
                            /*background: rgba($mainColor, 0.6);*/
                            color: #fff;
                        }
                        &:before{
                            content: '';
                            display: inline-block;
                            vertical-align: middle;
                            height: 100%;
                        }
                        i{
                            display: inline-block;
                            width: 24px;
                            height: 24px;
                            margin-left: 10px;
                            margin-right: 5px;
                            // background: url("../assets/images/btc.png") no-repeat;
                            background-size: 100% 100%;
                            vertical-align: middle;
                        }
                        span{
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
        .trade-menu-market{
            width: 80%;
            float: left;
            height: 100%;
            @media screen and (max-width: $tradeMedia1){
                width: 76%;
            }
            span{
                display: block;
                float: left;
                width: 20%;
                height: 100%;
                small{
                    display: block;
                    color: #888;
                    line-height: 28px;
                    font-size: 12px;
                }
                b{
                    font-weight: normal;
                    color: #ffffff;
                    font-size: 14px;
                }
            }
        }
    }
</style>
