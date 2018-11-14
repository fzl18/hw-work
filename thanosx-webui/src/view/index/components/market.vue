<template>
    <section class="market-box">
        <section class="market-area" v-if="getMarketInfoState">
            <div class="container">
                <ul>
                    <li @click="navSwitch(coinIndex)" v-for="(coin, coinIndex) in markets" :class="navStatus == coinIndex ? 'active' : ''">
                        <span>{{(coin || '').toUpperCase()}}</span>
                    </li>
                </ul>
                <div class="seek">
                    <input type="text" v-model="seekInput" />
                    <i class="iconfont icon-fangdajing"></i>
                </div>
            </div>            
        </section>

        <section class="container market">
            

            <load v-if="!showStatus" class="market-load" />

            <section v-if="showStatus" class="market-list-wrap" v-for="(list, index) in marketList">
                <h4 class="market-title">{{index == 0 ? lang[local].mainCoin : lang[local].newCoin}}</h4>
                <ul class="market-thead">
                    <li><span>{{lang[local].tradePair}}</span></li>
                    <li style="text-align:right;"><span>{{lang[local].currentRate}}</span></li>
                    <li style="text-align:right;"><span>{{lang[local].dayUpDown}}</span></li>
                    <li style="text-align:right;"><span>{{lang[local].topPrice}}</span></li>
                    <li style="text-align:right;"><span>{{lang[local].minPrice}}</span></li>
                    <li style="text-align:right;"><span>{{lang[local].tradeVolume}}</span></li>
                    <li><span>{{lang[local].turnover}}</span></li>
                </ul>

                <section class="market-list" v-if="list.length <= 0">
                    <dl class="empty">
                        <dt>{{lang[local].noCurrency}}</dt>
                    </dl>
                </section>
                <transition-group @leave="leave" v-if="list.length > 0" class="market-list" name="flip-list" tag="section" >
                    <dl v-for="coin in list" :key="coin.xnb + '_' + coin.rmb" :class="marketChangeAnimate(coin)" >
                        <dd>                            
                            <span style="font-size:14px">
                                {{upperCase(coin.xnb)}} / {{upperCase(coin.rmb)}}
                                <!-- <small>{{upperCase(coins[coin.xnb] && coins[coin.xnb].namech)}}</small> -->
                            </span>
                        </dd>
                        <dd style="text-align:right;">
                            <span v-if="coin.rmb == 'cnt'" >
                                <b style="font-size:14px;">{{toDecimals(getItemMarketData(coin, 1),  (coins[coin.rmb] && coins[coin.rmb].accuracy) || 4)}}</b>
                            </span>
                            <span v-else class="rmb" :class="getMarketDataColor(coin)">
                                <b style="font-size:14px;">{{toDecimals(getItemMarketData(coin, 1),  (coins[coin.rmb] && coins[coin.rmb].accuracy) || 4)}}</b>
                                <!-- <small>≈¥{{rmbDecimals(getItemMarketData(coin, 7))}}</small> -->
                            </span>
                        </dd>
                        <dd style="text-align:right;">
                            <span :class="getMarketDataColor(coin)" style="font-size:14px;">
                                {{getItemMarketData(coin, 2) > 0 ? '+' : ''}}{{perCentDecimals(getItemMarketData(coin, 2))}}%
                            </span>
                        </dd>
                        <dd style="text-align:right;"><span style="font-size:14px;">{{toDecimals(getItemMarketData(coin, 3), (coins[coin.rmb] && coins[coin.rmb].accuracy) || 4)}}</span></dd>
                        <dd style="text-align:right;"><span style="font-size:14px;">{{tobigNumber(getItemMarketData(coin, 4),  (coins[coin.rmb] && coins[coin.rmb].accuracy) || 4)}}</span></dd>
                        <!-- <dd><span>{{numDecimals(getItemMarketData(coin, 5),  (coins[coin.rmb] && coins[coin.rmb].accuracy) || 4)}}</span></dd> -->
                        <dd style="text-align:right;"><span style="font-size:14px;">{{toDecimals(getItemMarketData(coin, 5),  (coins[coin.rmb] && coins[coin.rmb].accuracy) || 4)}}</span></dd>
                        <dd><i class="iconfont icon-cf-c41" style="color:#4DC61E;font-size:25px;cursor: pointer;" @click="toTrade(coin)"></i></dd>                        
                    </dl>
                </transition-group>
            </section>
        </section>
    </section>
</template>

<script>
    import socket from '../../../common/webSocket'
    import bigNum from "bignumber.js"
    export default {
        name: "market",
        data (){
            return {
                whitelist : [],
                coins : [],
                districtInfo : [],
                markets : ["cnt", "usdt", "btc", "eth"],
                selfPick : [],
                socket : null,
                initMarketData : null,
                marketData : null,
                marketList : [[], []],
                navStatus : 0,
                getMarketCount : 0,
                sortIndex : 0,
                sortStatus : 0,
                chartObject : {},
                marked : {},
                showStatus : false,
                seekInput : '',
                trendData : null,
                updateMarketDataTime : null,
                marketDataTime : null,
                getMarketInfoState : false,
            };
        },
        watch : {
            showStatus (n, o){
                this.$store.commit('marketsShowStatus', n);
            },
            districtInfo (v, o) {
                // console.log('districtInfo');
                this.setMarketDefaultData();
                this.setMarketList();
                this.updateMarketData(this.initMarketData);

            },
            whitelist (v, o){
                if(Array.isArray(v)){
                    v.forEach((coinName, i) => {
                        v[i] = coinName.toUpperCase();
                    })
                };
                
            this.setMarketList()
            },
            initMarketData (v, o){
                // console.log('initMarketData');
                this.updateMarketData(v);
            },
            seekInput (v, o){
                if(!/^[a-zA-Z\/]+$/.test(v)){
                    this.seekInput = v.replace(/[^a-zA-Z\/]*/g, '');
                };
                this.seek();
            },
        },
        created (){
            this.getMarkedCookie()
            this.webSocket()
            this.getMarketInfo()
            this.getMainCoins()          
        },
        mounted(){
            
        },
        methods : {
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
            getMainCoins(){
                this.axios({
                    url : this.api.getMainCoins,
                    data : {
                    }
                }).then(res => {
                    this.whitelist = res.data
                }).catch()
            },
            toTrade (coin){
                console.log(coin)
                location.href = this.tradeMarketUrl.replace('{xnb}', coin.xnb).replace('{rmb}', coin.rmb)
            },
            seek (){
                if(this.seekInput == ''){
                    this.setMarketList();
                    return false;
                };
                var mainList = [];
                var newList = [];
                var state = /\//.test(this.seekInput);
                this.marketList.forEach(function (list, index) {
                    list.forEach(function (coin) {
                        if(state){
                            if(eval("/" + this.seekInput.toLowerCase().replace(/\//,'\\/') + "/").test(coin.xnb + '/' + coin.rmb)){
                                if(index == 0){
                                    mainList.push(coin);
                                }else{
                                    newList.push(coin);
                                }
                            };
                        }else{
                            if(eval('/' + this.seekInput.toLowerCase() + '/').test(coin.xnb + '/' + coin.rmb)){
                                if(index == 0){
                                    mainList.push(coin);
                                }else{
                                    newList.push(coin);
                                }
                            }
                        };
                    }, this)
                }, this);
                this.marketList = [mainList, newList];
            },
            leave (el, done) {
                done();
            },
            getMarketDataColor (coin){
                var v = this.marketData[coin.rmb][coin.xnb][2] ? this.marketData[coin.rmb][coin.xnb][2] : 0;
                return v > 0 ? 'riseColor' : v < 0 ? 'fallColor' : '';
            },
            getItemMarketData (coin, index){
                // if(coin.rmb == 'cnt' && coin.xnb == 'btc' && index == 5){
                //     console.log(this.marketData[coin.rmb][coin.xnb][index]);
                // };
                return this.marketData[coin.rmb][coin.xnb][index] ? this.marketData[coin.rmb][coin.xnb][index] : 0;
            },
            upperCase (val){
                return (val || '').toUpperCase();
            },
            getMarket (res){
                // console.log('getMarket');
                // console.time('updateMarketData');
                // console.log(JSON.stringify(res.data.cnt.btc), 'getMarket');
                if(!this.initMarketData) this.initMarketData = res.data;
                this.getMarketCount ++;
                if(this.getMarketCount > 1){
                    // this.updateMarketData(res.data);
                    if(this.marketDataTime){
                        this.marketDataTime = res.data;
                        if(this.updateMarketDataTime){
                            return;
                        }else{
                            this.updateMarketDataTime = setTimeout(() => {
                                this.updateMarketData();
                                this.updateMarketDataTime = null;
                            }, 300);
                        };
                    }else{
                        this.marketDataTime = res.data;
                        this.updateMarketData(res.data);
                    };
                };
            },
            updateMarketData (data){
                // console.log('updateMarketData');
                if(!(this.marketData && this.initMarketData)) return;
                this.showStatus = true;
                var self = this;
                var coinMarket = data || this.marketDataTime;
                var marketData = JSON.parse(JSON.stringify(this.marketData));
                for(var k in coinMarket){
                    for (var coin in coinMarket[k]){
                        if(marketData[k]){
                            if(self.getMarketCount == 1){
                                coinMarket[k][coin].push(true);
                            }else{
                                coinMarket[k][coin].push(false);
                            };
                            marketData[k][coin] = coinMarket[k][coin];
                            // self.$set(self.marketData[k], coin, coinMarket[k][coin]);
                        };
                    };
                };
                this.marketData = marketData;
                // console.log(JSON.stringify(marketData.cnt.btc), 'updateMarketData');
                // console.timeEnd('updateMarketData');
                this.$store.commit('marketData', JSON.parse(JSON.stringify(marketData)));
                // this.initTrandChart();
            },
            getTrend (res){
                // console.log(res);
                if(this.trendData){
                    var data = res.data;
                    if(typeof data == 'object'){
                        for(var keys in data){
                            for(var k in data[keys]){
                                this.trendData[keys][k] = data[keys][k];
                                this.trendChart(data[keys][k], k,  keys);
                            };
                        };
                    };
                }else{
                    this.trendData = res.data;
                    this.initTrandChart();
                }
            },
            initTrandChart (){
                if(this.trendData){
                    var data = this.trendData;
                    setTimeout(() => {
                        if(typeof data == 'object'){
                            for(var keys in data){
                                for(var k in data[keys]){
                                    this.trendChart(data[keys][k], k,  keys);
                                };
                            };
                        };
                    }, 50)
                }
            },
            trendChart (data,  k,  keys){
                // console.log(JSON.stringify(data), k, keys);
                var elm = document.querySelector('#chartTrade_' + k + '_' + keys);
                if(!elm) return;
                var lineC = '#444444';
                if(this.marketData && this.marketData[keys] && this.marketData[keys][k] && this.marketData[keys][k][2]){
                    lineC = this.marketData[keys][k][2] * 1 > 0 ? '#ff400c' : this.marketData[keys][k][2] * 1 < 0 ? '#0cba71' : '#444444';
                };
                if(data.length <= 1){
                    return false;
                };
                var w = elm.clientWidth;
                var h = elm.clientHeight - 1;
                // console.log(h);
                var yh = 0;
                var smallY = 0;
                // data = data.splice(-15);
                // console.log(data);
                var xw = w / (data.length - 1);
                data.forEach(item => {
                    if(yh){
                        yh = yh  > item[1] * 1 ? yh : item[1] * 1;
                    }else{
                        yh = item[1] * 1;
                    };
                    if(smallY){
                        smallY = smallY  < item[1] * 1 ? smallY : item[1] * 1;
                    }else{
                        smallY = item[1] * 1;
                    };
                });
                smallY = yh - smallY;
                // console.log(yh, xw, k, keys);
                var c = '';
                data.forEach((item, index) => {
                    if(index != 0){
                        c += ' ';
                    };
                    // c += index * xw + ',' + (h - item[1]*yh + 1);
                    c += index * xw + ',' + (h - (yh - item[1]) / smallY * h +1);
                });
                var html = '<svg class="peity" height="' + (h + 1) + '" width="' + w + '"><polyline fill="none" points="' + c + '" stroke="' + lineC + '" stroke-width="1" stroke-linecap="square"></polyline></svg>';
                elm.innerHTML = html;
            },
            setMarketList (){
                var self = this;
                var marketMain = [];
                var marketNew = [];
                var {whitelist, districtInfo, markets, navStatus} = this;
                if(navStatus != markets.length){
                    var data = districtInfo[markets[navStatus]] || [];
                    data.forEach(function (coin){
                        if(coin && coin.xnb && whitelist.indexOf(coin.xnb.toUpperCase()) >= 0){
                            marketMain.push(coin);
                        }else{
                            marketNew.push(coin);
                        };
                    });
                }else{
                    var coinMarket = this.marked;
                    for(var k in coinMarket){
                        for (var coin in coinMarket[k]){
                            if(coinMarket[k][coin] && coinMarket[k][coin].xnb && whitelist.indexOf(coinMarket[k][coin].xnb.toUpperCase()) >= 0){
                                marketMain.push(coinMarket[k][coin]);
                            }else{
                                marketNew.push(coinMarket[k][coin]);
                            };
                        };
                    };
                };
                this.marketList = [marketMain, marketNew];
                this.initTrandChart();
            },
            setMarketDefaultData (){
                // console.log('setMarketDefaultData');
                if(this.marketData) return;
                var marketsData = {};
                var districtInfo = this.districtInfo;
                for(let k in districtInfo){
                    if(!marketsData[k]) marketsData[k] = {};
                    districtInfo[k].forEach(function (coin){
                        marketsData[k][coin.xnb] = [coin.xnb + '_' + k];
                        for (let i = 1; i < 8 ; i++){
                            marketsData[k][coin.xnb][i] = 0;
                        };
                        marketsData[k][coin.xnb].push(true);
                    })
                };
                this.marketData = marketsData;
            },
            navSwitch (index){
                this.navStatus = index;
                var self = this;
                this.setMarketList();
                this.seek();
                for(var chart in this.chartObject){
                    if(this.chartObject[chart]){
                        this.chartObject[chart].destroy();
                    };
                };
                this.chartObject = {};
                this.sortStatus = 0;
            },
            getMarketInfo (){
                this.axios({
                    url : this.api.getMarketInfo,
                }).then((res) => {
                    var data = res.data;
                    this.getMarketInfoState = true;
                    this.coins = data.coins;
                    this.districtInfo = data.districtInfo;
                    this.selfPick = data.selfPick;
                    // this.whitelist = data.whitelist;
                    this.markets = data.markets;
                    this.$store.commit('coins', data.coins);
                    this.$store.commit('districtInfo', data.districtInfo);
                    this.$store.commit('markets', data.markets);
                }).catch((err) => {
                    console.log(err);
                });
            },
            webSocket (){
                var maxConnect = 10;
                var connectCount = 0;
                var self = this;
                this.socket = new socket({
                    url : this.webSocketUrl,
                });
                this.socket.close = function (event){
                    if(connectCount > maxConnect){
                        // self.alert(self.lang.checkNetwork);
                        self.$store.commit('msg/err', self.lang[local].checkNetwork)
                        return false;
                    };
                    setTimeout(function (){
                        connectCount ++;
                        socket.connect();
                    }, 3000)
                };
                this.socket.connect();
                this.socket.on("push_home_market_quote", this.getMarket, this);
                this.socket.on("push_home_market_trend", this.getTrend, this);
                this.socket.send("pull_home_market_quote");
                this.socket.send("pull_home_market_trend");
            },
            clickSort (status, sortIndex){
                this.sortIndex = sortIndex;
                if(status * 2 == this.sortStatus || (status * 2 - 1) == this.sortStatus){
                    if(this.sortStatus % 2 == 0){
                        this.sortStatus = this.sortStatus - 1;
                        this.sortAscDesc('main', 'asc');
                        this.sortAscDesc('new', 'asc');
                    }else{
                        this.sortStatus = this.sortStatus + 1;
                        this.sortAscDesc('main', 'desc');
                        this.sortAscDesc('new', 'desc');
                    };
                }else{
                    this.sortStatus = status * 2;
                    this.sortAscDesc('main', 'desc');
                    this.sortAscDesc('new', 'desc');
                };
            },
            menuSortClass (index){
                if(this.sortStatus % 2 == 0 && (this.sortStatus / 2) == index){
                    return 'desc';
                };
                if(this.sortStatus % 2 == 1 && ((this.sortStatus + 1) / 2) == index){
                    return 'asc';
                };
                return '';
            },
            sortAscDesc (name, type){
                var self = this;
                name= name || 'main';
                var sortIndex = this.sortIndex;
                var sortId = [];
                var data = name == 'main' ? this.marketList[0] : this.marketList[1];
                data.forEach(function (coins){
                    sortId.push(coins.xnb + '_' + coins.rmb);
                });
                if(type == 'asc'){
                    data.sort(function (a, b){
                        return self.getItemMarketData(a, sortIndex) * 1 - self.getItemMarketData(b, sortIndex) * 1 || sortId.indexOf(a.xnb + '_' + a.rmb) - sortId.indexOf(b.xnb + '_' + b.rmb);
                    });
                }else{
                    data.sort(function (a, b){
                        return self.getItemMarketData(b, sortIndex) * 1 - self.getItemMarketData(a, sortIndex) * 1 || sortId.indexOf(a.xnb + '_' + a.rmb) - sortId.indexOf(b.xnb + '_' + b.rmb);
                    });
                };

            },
            getMarkedCookie (){
                var marked = {};
                marked = JSON.parse(this.$cookies.get('marked')) || {};
                this.markets.forEach(function (coin){
                    if(!marked[coin]){
                        marked[coin] = {};
                    };
                }, this);
                this.marked = marked;
            },
            clickMarked (coin){
                var marked = JSON.parse(JSON.stringify(this.marked));
                if(marked[coin.rmb] && marked[coin.rmb][coin.xnb]){
                    delete marked[coin.rmb][coin.xnb];
                }else{
                    marked[coin.rmb][coin.xnb] = coin;
                };
                this.$cookies.set('marked', JSON.stringify(marked));
                this.marked = marked;
            },
            marketChangeAnimate (coin){
                var data = this.marketData[coin.rmb][coin.xnb];
                data = JSON.parse(JSON.stringify(data));
                if(data[data.length - 1] == false && this.getMarketCount > 1){
                    setTimeout(() => {
                        data = this.marketData[coin.rmb][coin.xnb];
                        data = JSON.parse(JSON.stringify(data));
                        data[data.length - 1] = true;
                        this.$set(this.marketData[coin.rmb], coin.xnb, data);
                    }, 2000);
                    if(data[2] > 0){
                        return 'rise';
                    }else{
                        return 'fall';
                    };
                };
                return '';
            },
        }
    }
</script>

<style lang="scss">

    @import "../../../assets/css/var.scss";

    $areaItemWidth: 160 / $webWidthFigure * 100%;
    $theadItemWidth: 160 / $webWidthFigure * 100%;
    $listHeight : 55px;
    $border : solid 1px $marketBorderColor;
    $areaHeight : 60px;
    $areaList : "cnt", "pyc", "usdt", "btc", "eth", "wbc", "del";

    .market-box{
        padding-bottom: 40px;
        .market-load{
            max-width: $maxWidth;
            min-width: $minWidth;
            margin: 0 auto;
        }
        .market-title{
            height: $listHeight;
            width: 100%;
            line-height: $listHeight;
            color: #515151;
            font-weight: 700;
            font-size: 16px;
        }
        .market-area{
            border-bottom: $border;
            height: $areaHeight;
            background: #FF6500;
            box-shadow:0 10px 10px rgba(182, 182, 182, 0.3);
            ul{
                overflow: hidden;
                width: 70%;
                float: left;
            }
            li{
                display: block;
                float: left;
                width:10%;
                height: 100%;
                line-height: 1;
                text-align:left;
                padding-left: 15px;
                font-size: 16px;
                font-weight: normal;
                cursor: pointer;
                position: relative;
                user-select: none;
                color:#FFC699;
                &.active, &:hover{
                    color: #fff;
                    &:after{
                        border-left-color:#fff;
                    }
                }
                &:after{
                    content:'';
                    height:0;
                    width:0;
                    border: 5px solid transparent;
                    border-left-color: rgba(255, 255, 255, .5);
                    position: absolute;
                    left: 0;
                    bottom: 8%;
                }
                $icoSize : 26px;
                $icoMarR : 10px;

                span{
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 22px;
                }
            }

            .seek{
                display: block;
                position: relative;
                float: right;
                width: 20%;
                & > i{
                    display: block;
                    position: absolute;
                    font-size:26px;
                    right: 0;
                    top: 0;
                    height: 100%;
                    padding: 0 10px;
                    cursor: pointer;
                    line-height: $areaHeight;
                }
                input{
                    display: block;
                    float: right;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    top:10px;
                    border: {
                        top : $border;
                        right : $border;
                        bottom: none;
                        left: none;
                    };
                    background: $marketAreaBg;
                    padding: 5px 50px 5px 20px;
                    font-size: 18px;
                    border-radius: 20px;
                }
            }
        }
    }

    .market-thead{        
        width: 100%;
        height: $listHeight;
        margin: 0 auto;
        overflow: hidden;
        background:#F6F6F6;
        li{
            display: block;
            float: left;
            width: $theadItemWidth;
            text-align: center;
            font-size: 14px;
            color: #8C8C8C;
            user-select: none;
            &:first-child{
                text-align:left;
                padding-left:20px;
            }
            &:last-child{
                width: 100% - $theadItemWidth * 6;
            }
            span{
                display: inline-block;
                vertical-align: middle;
                line-height: $listHeight;

            }
        }
    }
    .market-list-wrap{
        width: 100%;
        margin: 30px auto;
    }

    $namePaddingL : 60px;
    
    .market-list{
        width: 100%;
        overflow: hidden;
        dl{
            display: block;
            width: 100%;
            overflow: hidden;
            position: relative;
            border: {
                bottom:1px solid #F1F1F1;
            };
            &.flip-list-move {
                transition: transform 500ms;
            }
            dt{
                width: 100%;
                text-align: center;
                line-height: $listHeight;
                height: $listHeight;
                color: $viceFontColor;
            }
            dd{
                display: block;
                float: left;
                width: $theadItemWidth;
                height: $listHeight;
                line-height: $listHeight;
                color: #515151;
                text-align: center;
                position: relative;
                font-size: 16px;
                .homeChartTrade{
                    margin-top: 4px;
                    width: 99%;
                    height: 92%;
                }
                &:last-child{
                    width: 100% - $theadItemWidth * 6;
                }
                span.rmb{
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1.4;
                    b{
                        display: block;
                        color: $fontColor;
                        font-size: 14px;
                        font-weight: normal;
                    }
                    small{
                        display: block;
                        color: $marketListSamllFont;
                        font-size: 12px;
                        text-align: left;
                    }
                }
                &:nth-child(1){
                    text-align: left;
                    padding-left:20px;
                    .marked{
                        display: block;
                        vertical-align: middle;
                        margin-right: 5px;
                        cursor: pointer;
                        user-select: none;
                        position: absolute;
                        left: 4px;
                        &.marked2{
                            left: 16px;
                            width: 28px;
                            height: 28px;
                            top: 50%;
                            transform: translateY(-50%);
                            background-size: 100% 100%;
                            &:before{
                                display: none;
                            }
                        }
                        &:before{
                            content: '\e604';
                            @include iconfont(24px);
                        }
                        &.active:before{
                            content: '\e605';
                            color: $marketAreaZixuan;
                        }
                    }
                    span{
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 1.4;
                        b{
                            display: block;
                            color: $fontColor;
                            font-size: 14px;
                            font-weight: normal;
                        }
                        small{
                            display: block;
                            color: $marketListSamllFont;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }




</style>
