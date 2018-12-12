<template>
    <section class="trade-main">
        <section class="trade-left">
            <section class="trade-left-top">
                <trade-menu />
                <chart />
            </section>
            <section class="trade-left-bottom">

                <section class="trade-user">
                    <span :class="classActive(userViewStatue == 1)" @click="userViewStatue = 1">{{lang[local].entrustNow}}</span>
                    <span :class="classActive(userViewStatue == 2)" @click="userViewStatue = 2">{{lang[local].dealRecord}}</span>
                </section>

                <section class="trade-user-main">
                    <user-entrust v-if="loginInfo && loginInfo.uid && loginInfo.username && userViewStatue == 1" />
                    <user-deal v-if="loginInfo && loginInfo.uid && loginInfo.username && userViewStatue == 2" />
                    <section class="trade-user-out" v-if="loginInfo.uid == '' || loginInfo.username == ''">
                        <div>
                            <p> <i class="iconfont icon-logo" style="font-size:120px;line-height:0px;"></i> </p>
                            {{lang[local].tradeLogin1}} <a class="buyColor" :href="loginUrl">{{lang[local].login2}}</a> {{lang[local].tradeLogin2}} <a class="sellColor" :href="registerUrl">{{lang[local].freeRegister}}</a> {{lang[local].tradeLogin3}}
                        </div>
                    </section>
                </section>
            </section>
        </section>
        <section class="trade-right">
            <section class="trade-right-top">
                <deal />
                <depth />
            </section>
            <section class="trade-right-bottom">
                <buy />
                <sell />
            </section>
        </section>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    import deal from './deal'
    import tradeMenu from './menu'
    import Chart from "./chart";
    import Socket from '../../../common/webSocket'
    import depth from "./depth";
    import Buy from "./buy";
    import Sell from "./sell";
    import UserEntrust from "./userEntrust";
    import UserDeal from "./userDeal";
    export default {
        name: "index",

        components : {
            UserDeal,
            UserEntrust,
            Sell,
            Buy,
            depth,
            Chart,
            deal,
            tradeMenu
        },
        data (){
            return {
                socket : null,
                userViewStatue : 1,
            };
        },
        computed : {
            ...mapState([
                'dealState',
                'dealTeam',
                'depthState',
                'buyData',
                'sellData',
                'userOrder',
                'userOrderState',
                'userOrderId',
                'userDealState',
                'withdrawal',
                'chartBarState',
                'resolution',
                'districtInfo',
                'interval',
                'websocketState',
            ]),
        },
        beforeRouteUpdate (to, from, next){
            this.$store.commit('rmb', to.params.rmb);
            this.$store.commit('xnb', to.params.xnb);
            this.clearStore();
            next();
            this.checkParam();
            this.sendWebSockInit();
            this.$store.commit('chartBarState', false);
            this.$store.commit('websocketState', this.websocketState + 1);
        },
        created (){
            this.$store.commit('rmb', (this.$route.params && this.$route.params.rmb || '').toLowerCase());
            this.$store.commit('xnb', (this.$route.params && this.$route.params.xnb || '').toLowerCase());
            this.getMarketInfo();
        },
        watch : {
            loginInfo (n, o){
                this.connect();
            },
            withdrawal (n, o){
                if(n && n.order_id){
                    this.socket.send("withdrawal", {
                        order_id : n.order_id
                    });
                };
            },
            buyData (n, o){
                if(n && n.price && n.count){
                    this.socket.send("order", {
                        type : "Buy",
                        // market : this.xnb,
                        // market2 : this.rmb,
                        price : n.price,
                        count : n.count,
                        ts : 0,
                    });
                };
            },
            sellData (n, o){
                if(n && n.price && n.count){
                    this.socket.send("order", {
                        type : "Sell",
                        // market : this.xnb,
                        // market2 : this.rmb,
                        price : n.price,
                        count : n.count,
                        ts : 0,
                    });
                };
            },
            resolution (n, o){
                // console.log(n);
                this.$store.commit('chartBarState', false);
                this.sendK();
            },
        },
        beforeDestroy (){
            this.clearStore();
            if(this.socket){
                this.socket.ws.close();
            };
        },
        mounted (){
            // console.log(this.$route.query);
            if(typeof this.webSocketUrl == 'string' && this.webSocketUrl){
                this.socket = new Socket({
                    debug : this.$route.query.debug || false,
                    url : this.webSocketUrl
                });
                window.gujinshunSocket = this.socket;
            }else{
                console.warn('webSocket url 错误！');
            };
            this.push_heart();
            this.websocketError();
            this.push_user_market();
            this.push_deal_order_list();
            this.push_merge_depth_order_list();
            this.push_user_assets();
            this.order_resp();
            this.push_user_order();
            this.push_user_deal();
            this.withdrawal_resp();
            this.push_home_market_quote();
            this.push_kline_graph();
            this.websocketClose();
            this.connect();
        },
        methods : {
            logout (){
                this.axios({
                    url : this.api.logout,
                }).then((res) => {
                    this.loginStatus = false;
                }).catch((err) => {
                    console.log(err);
                    location.reload();
                });
            },
            sendK (){
                var n = this.resolution;
                this.socket.send('pull_kline_graph', {
                    market : this.xnb + "_" + this.rmb,
                    k_line_type : n == 'W' ||n == 'M' ? '10080' : n == 'D' ? (24 * 60) + '' : n,
                    k_line_count : '200',
                });
            },
            checkParam (){
                if(this.districtInfo){
                    if(this.districtInfo[this.rmb]){
                        if(this.districtInfo[this.rmb].some(item => item.xnb == this.xnb)){

                        }else{
                            this.$router.push('/pyc/cnt');
                        };
                    };
                };
            },
            clearStore (){
                this.$store.commit('xnbAssets', 0);
                this.$store.commit('rmbAssets', 0);

                this.$store.commit('clearDeal');

                this.$store.commit('clearDepth', false);

                this.$store.commit('chartBarState', false);

                this.$store.commit('userOrderState', false);
                this.$store.commit('userOrder', []);

                this.$store.commit('userDealState', false);
                this.$store.commit('userDeal', []);
            },
            connect (){
                if(this.loginGetStatus){
                    this.socket.connect(() => {
                        this.sendWebSockInit();
                    });
                };
            },
            websocketError (){
                var self = this;
                this.socket.error = function (err){
                    console.log('websocket error!');
                    self.clearStore();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].webSocketError);
                    setTimeout(() => {
                        self.connect();
                    }, 3000);
                };
            },
            websocketClose (){
                var self = this;
                this.socket.close = function (){
                    console.log('websocket close!');
                    self.clearStore();
                    setTimeout(() => {
                        self.connect();
                    }, 3000);
                };
            },
            sendWebSockInit (){
                var param = {
                    market : this.xnb + '_' + this.rmb,
                };
                if(this.loginInfo.uid){
                    param.uid = this.loginInfo.uid;
                    param.token = this.loginInfo.token;
                };
                this.socket.send("pull_user_market", {
                    ...param
                });
            },
            push_home_market_quote (){
                this.socket.on("push_home_market_quote", (res) => {
                    // console.log(res.data);
                    var data = res.data || {};
                    this.$store.commit('market_quote', (data && data[this.rmb] && data[this.rmb][this.xnb]) || []);
                });
            },

            getMarketInfo (){
                this.axios({
                    url : this.api.getMarketInfo
                }).then((res) => {
                    // console.log(reg.data)
                    this.$store.commit('coins', res.data.coins || {});
                    this.$store.commit('districtInfo', res.data.districtInfo || {});
                    this.$store.commit('markets', res.data.markets || {});
                }).catch((err) => {
                    this.$store.commit('coins', {});
                    this.$store.commit('districtInfo', {});
                    this.$store.commit('markets', {});
                    console.log(err, this.api.getMarketInfo);
                });
            },

            // 发送用户id token
            push_user_market (){
                this.socket.on("push_user_market", (res) => {
                    if(res && res.data && res.data[0] == 0){
                        this.socket.send("pull_deal_order_list");
                        this.socket.send('pull_home_market_quote');
                        this.socket.send('pull_merge_depth_order_list');
                        this.sendK();
                        if(this.loginInfo.uid){
                            this.socket.send('pull_user_assets');
                            this.socket.send('pull_user_order');
                            this.socket.send('pull_user_deal');
                        };
                    }else if(res && res.data && res.data[0] == 1){
                        this.$store.commit('msg/err', this.lang[this.local].tradeLogin4);
                        this.logout()
                        setTimeout(() => {
                            this.toLogin();
                        }, 2000);
                    }else{
                        this.$store.commit('msg/err', this.lang[this.local]['webSocketError'+ res.data[0]] ||this.lang[this.local].webSocketError );
                    }
                });
            },

            // K线
            push_kline_graph (){
                this.socket.on("push_kline_graph", (res) => {
                    var data = res.data || [];
                    // console.log('push_kline_graph', JSON.stringify(data));
                    if(Array.isArray(data)){
                        // console.log('push_kline_graph', data);
                        var bar = [];
                        data.forEach((item) => {
                            bar.push({
                                time : item[0] * 1,
                                close : item[4] * 1,
                                open : item[1] * 1,
                                high : item[2] * 1,
                                low : item[3] * 1,
                                volume : item[5] * 1
                            });
                        });
                        if(this.chartBarState){
                            this.$store.commit('subscribeBarsData', bar[0]);
                        }else{
                            this.$store.commit('chartBar', bar);
                            this.$store.commit('chartBarState', true);
                        };
                    };
                });
            },
            // 余额
            push_user_assets (){
                this.socket.on("push_user_assets", (res) => {
                    var asset = res.data.asset || {};
                    this.$store.commit('assets', asset);
                    this.$store.commit('xnbAssets', parseFloat(asset[this.xnb] || 0).toLocaleString().replace(/\,/g, ''));
                    this.$store.commit('rmbAssets', parseFloat(asset[this.rmb] || 0).toLocaleString().replace(/\,/g, ''));
                });
            },

            // 撤销订单
            withdrawal_resp (){
                this.socket.on("withdrawal_resp", (res) => {
                    this.socket.send('pull_user_assets');
                    this.$store.commit('withdrawal', {});
                });
            },
            // 心跳
            push_heart (){
                this.socket.on("push_heart", (res) => {
                    var n = (new Date()).getTime();
                    var o = res.data[0][0];
                    var g = Math.floor(n * 1 - o *1) / 2;
                    if(g <= 100){
                        this.$store.commit('netState', 1);
                        this.$store.commit('netStateTitle', this.lang[this.local].netState1 + this.lang[this.local].netState3 + '\n' + this.lang[this.local].netState2 + g + 'ms');
                        return;
                    };
                    if(g <= 250){
                        this.$store.commit('netState', 2);
                        this.$store.commit('netStateTitle', this.lang[this.local].netState1 + this.lang[this.local].netState4 + '\n' + this.lang[this.local].netState2 + g + 'ms');
                        return;
                    };
                    if(g <= 500){
                        this.$store.commit('netState', 3);
                        this.$store.commit('netStateTitle', this.lang[this.local].netState1 + this.lang[this.local].netState5 + '\n' + this.lang[this.local].netState2 + g + 'ms');
                        return;
                    };
                    if(g > 500){
                        this.$store.commit('netState', 4);
                        this.$store.commit('netStateTitle', this.lang[this.local].netState1 + this.lang[this.local].netState6 + '\n' + this.lang[this.local].netState2 + g + 'ms');
                        return;
                    };
                    this.$store.commit('netState', 1);
                    this.$store.commit('netStateTitle', this.lang[this.local].netState1 + this.lang[this.local].netState7);
                });
            },

            webSocketError (res, callback){
                var error_code = res.data.error_code;
                if(error_code != 0 && error_code * 1 > 0){
                    this.$store.commit('msg/err', this.lang[this.local]['webSocketError' + error_code] || '未知的 webSocket 错误码 ！');
                }else{
                    if(typeof callback == 'function'){
                        callback.call(this);
                    };
                };
            },

            // 提交订单
            order_resp (){
                this.socket.on("order_resp", (res) => {
                    this.webSocketError(res, function (){
                        this.$store.commit('msg/add', this.lang[this.local].entrustSuccess);
                        this.socket.send('pull_user_assets');
                        this.$store.commit('buyData', {});
                        this.$store.commit('sellData', {});
                    });
                });
            },

            // 实时成交
            push_deal_order_list (){
                this.socket.on("push_deal_order_list", (res) => {
                    // console.log(JSON.stringify(res), 'push_deal_order_list');
                    var data = res.data || [];
                    if(this.dealState){
                        // console.log(JSON.stringify(data), 'push_deal_order_list');
                        this.$store.commit('dealTeam', data);
                    }else{
                        this.$store.commit('deal', data.reverse());
                        this.$store.commit('dealState', true);
                    };
                });
            },

            // 深度
            push_merge_depth_order_list (){
                this.socket.on("push_merge_depth_order_list", (res) => {
                    var data = res.data || [];
                    if(this.depthState){
                        if(data.sell){
                            // console.log(JSON.stringify(data.sell), 'sell');
                            this.$store.commit('upDepthSell', data.sell || []);
                        };
                        if(data.buy){
                            // console.log(JSON.stringify(data.buy), 'buy');
                            this.$store.commit('upDepthBuy', data.buy || []);
                        };
                    }else{
                        // console.log(JSON.stringify(data), 'push_merge_depth_order_list');
                        this.$store.commit('depthState', true);
                        this.$store.commit('depthSell', data.sell || []);
                        this.$store.commit('depthBuy', data.buy || []);
                    };
                });
            },

            //我的委托
            push_user_order (){
                this.socket.on("push_user_order", (res) => {
                    // console.log(JSON.stringify(res), 'push_user_order');
                    var data = res.data || [];
                    if(this.userOrderState){
                        // console.log(JSON.stringify(res), 'push_user_order');
                        /*this.$store.commit('msg/add', {
                            title : this.lang[this.local].myEntrust,
                            msg : this.priceAccuracy(item[3]) +
                                    this.upperCase(this.rmb) + ' ' +
                                    (item[2] == 'buy'
                                        ? '<span class="buyColor">' + this.lang[this.local].buy + '</span> '
                                        : '<span  class="sellColor">' + this.lang[this.local].sell + '</span> '
                                    ) + ' ' +
                                    this.numAccuracy(item[4]) +
                                    this.upperCase(this.xnb) + ' ' +
                                    this.lang[this.local].entrustSuccess,
                        });*/
                        this.$store.commit('upUserOrder', data);
                    }else{
                        this.$store.commit('userOrderState', true);
                        this.$store.commit('userOrder', data);
                    };
                });
            },

            //我的成交记录
            push_user_deal (){
                let msgText = '';
                let msgTime = null;
                this.socket.on("push_user_deal", (res) => {
                    // console.log(JSON.stringify(res.data), 'push_user_deal');
                    var data = res.data || [];
                    if(this.userDealState){
                        this.socket.send('pull_user_assets');
                        if(data.length){
                            var item = data[0];
                            if(Array.isArray(item)){
                                msgText = this.priceAccuracy(item[3]) +
                                    this.upperCase(this.rmb)  + ' ' +
                                    (item[2] == 'buy'
                                            ? '<span class="buyColor">' + this.lang[this.local].buy + '</span> '
                                            : '<span  class="sellColor">' + this.lang[this.local].sell + '</span> '
                                    )  + ' ' +
                                    item[4] +    //this.numAccuracy(item[4])
                                    this.upperCase(this.xnb) + ' ' +
                                    this.lang[this.local].deal;
                                if(!msgTime){
                                    this.$store.commit('msg/add', {
                                        title : this.lang[this.local].deal,
                                        msg : msgText,
                                    });
                                    msgTime = setTimeout(() => {
                                        this.$store.commit('msg/add', {
                                            title : this.lang[this.local].deal,
                                            msg : msgText,
                                        });
                                        msgTime = null;
                                    }, 3500);
                                };
                            };
                            this.$store.commit('pushUserDeal', data);
                        };
                    }else{
                        this.$store.commit('userDealState', true);
                        this.$store.commit('userDeal', data);
                    };
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    $bottomH : calc(32% + 5px);
    .trade-left{
        width: 60%;
        float: left;
        height: 100%;
        position: relative;
        z-index: 100;
    }
    .trade-right{
        z-index: 90;
        width: calc(40% - 5px) ;
        float: right;
        height: 100%;
        position: relative;
        margin-left:5px;
        // background: #2C2C2C;
        // border-left: solid 1px $tradeBorderColor;
    }
    // @media screen and (min-width: 1920px){
    //     .trade-left{
    //         width: 60%;
    //         position: relative;            
    //         height: 100%;
    //         left: 0;
    //         top: 0;
    //     }
    //     .trade-right{
    //         width: calc(40% - 5px) ;
    //         position: relative;
    //         right: 0;
    //         top: 0;
    //     }
    // }
    .trade-right-top,.trade-left-top{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: $bottomH;
        
        // border-bottom: solid 1px $tradeBorderColor;
    }
    .trade-right-top{bottom:45%;}
    .trade-right-bottom,.trade-left-bottom{
        position: absolute;
        left: 0;
        bottom: -5px;
        width: 100%;
        height: $bottomH;
        .coo{
            height:100%;
        }
    }
    .trade-right-bottom{height:45%;}
    .trade-box{
        background: $tradeBg;
        @include fullWH;
    }
    .trade-main{
        display: block;
        position: absolute;
        top: $headerHeight;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        // min-height:700px;
    }
    @media screen and (max-height: 700px) {
        .trade-right-bottom{height:55%;}
        .trade-right-top{bottom:55%;}
        .trade-left-bottom{            
            height:35%;
            .coo{
                height:100%;
            }
        }
        .trade-left-top{bottom:35%;}
    }
</style>
