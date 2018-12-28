import Vue from 'vue';
import Vuex from 'vuex';
import bigNum from "bignumber.js"
import commonState from '../../../common/store'

Vue.use(Vuex);

function depth (data, depthSellKey, type){
    if(Array.isArray(data)){
        data.forEach(item => {
            var itemK = item[0];
            if(depthSellKey[itemK]){
                // var n = (parseFloat(depthSellKey[itemK]) + parseFloat(item[1])).toFixed(8);
                var n = (bigNum(depthSellKey[itemK]).plus(item[1])).toFixed(8);
                // console.log(itemK, n);
                if(n == 0){
                    delete depthSellKey[itemK];
                }else{
                    depthSellKey[itemK] = n;
                };
                if(n < 0){
                    console.log(JSON.stringify(item));
                };
            }else{
                if(item[1] < 0){
                    // console.log(JSON.stringify(item), 'init');
                }else{
                    depthSellKey[itemK] = item[1];
                };
            };
        });
    };
    var key = Object.keys(depthSellKey);
    if(type == 'buy'){
        key.sort((a, b) => {
            // return (parseFloat(b) - parseFloat(a)).toFixed(8);
            return (bigNum(b).minus(a)).toFixed(8);
        });
    }else{
        key.sort((a, b) => {
            // return (parseFloat(a) - parseFloat(b)).toFixed(8);
            return (bigNum(a).minus(b)).toFixed(8);
        });
    };
    var depthSell = [];
    key.forEach(k => {
        depthSell.push([k, depthSellKey[k]]);
    });
    return {
        k : depthSellKey,
        d : depthSell
    }
};

export default new Vuex.Store({
    state : {

        websocketState : 1,
        netState : 5,
        netStateTitle : '',
        chartInitState : true,

        coins : {},
        districtInfo : {},
        markets : [],

        market_quote : {},

        deal : [],
        dealState : false,
        dealTeam : [],
        dealTeamTimer : null,

        userOrder : [],
        userOrderId : [],
        userOrderState : false,
        withdrawal : {},

        userDeal : [],
        userDealState : false,

        resolution : '15',
        interval : '15',
        subscribeBarsData : [],

        depthSell : [],
        depthSellKey : {},
        depthBuy : [],
        depthBuyKey : {},
        depthState : false,

        buyData : {},
        sellData : {},

        clickData : {},

        chartBar : [],
        chartBarState : false,

        assets : {},
        nowPrice : [],

        xnbAssets : 0.00,
        rmbAssets : 0.00,

        xnb : 'pyc',
        rmb : 'cnt',
        ...commonState.state
    },
    actions : {
        ...commonState.actions,
    },
    mutations : {
        netState (state, data){
            state.netState = data;
        },
        netStateTitle (state, data){
            state.netStateTitle = data;
        },
        chartInitState (state, data){
            state.chartInitState = data;
        },
        websocketState (state, data){
            state.websocketState = data;
        },
        xnb (state, data){
            state.xnb = data || 'pyc';
        },
        rmb (state, data){
            state.rmb = data || 'cnt';
        },
        subscribeBarsData (state, data){
            state.subscribeBarsData = data;
        },
        resolution (state, data){
            state.resolution = data;
        },
        chartBarState (state, data){
            state.chartBarState = data;
        },
        chartBar (state, data){
            state.chartBar = data;
        },
        clickData (state, data){
            state.clickData = data;
        },
        market_quote (state, data){
            state.market_quote = data || [];
        },
        nowPrice (state, data){
            state.nowPrice = data ||  [0, "sell", "0", "0", "0"];;
        },
        withdrawal (state, data){
            state.withdrawal = data;
        },
        pushUserDeal (state, data){
            if(Array.isArray(data)){
                if(state.userDeal.length >= 100){
                    state.userDeal.splice(data.length * -1, data.length);
                };
                state.userDeal = data.concat(state.userDeal);
            };
        },
        userDeal (state, data){
            state.userDeal = data;
        },
        userDealState (state, data){
            state.userDealState = data;
        },
        userOrderId (state, data){
            state.userOrderId = data;
        },
        userOrderState (state, data){
            state.userOrderState = data;
        },
        userOrder (state, data){
            state.userOrder = data;
            var userOrderId = [];
            data.forEach(function (d){
                userOrderId.push(d[0]);
            });
            this.commit('userOrderId', userOrderId);
        },
        upUserOrder (state, data){
            var newData = [];
            var userOrder = JSON.parse(JSON.stringify(state.userOrder));
            // console.log(data)
            if(state.userOrderId.length){
                data.forEach(function (d, dIndex){
                    var i = state.userOrderId.indexOf(d[0]);
                    if(i >= 0){
                        if(d[6] == 'withdrawal'){
                            userOrder.splice(i, 1, d);
                        }else{
                            userOrder.splice(i, 1, d);
                        };
                    }else{
                        if(d[6] == 'withdrawal'){
                        }else{
                            newData.push(d);
                        };
                    };
                });
                data = newData;
            }else{
                data.forEach(function (d, dIndex){
                    if(d[6] != 'withdrawal'){
                        newData.push(d);
                    };
                });
                data = newData;
            };
            // if(userOrder.length >= 100){
            //     userOrder.splice(data.length * -1, data.length);
            // };
            var newUserOrder = [];
            userOrder.forEach(function (d){
                if(d[6] != 'withdrawal'){
                    newUserOrder.push(d);
                };
            });
            let nData = data.concat(newUserOrder);
            if(nData.length > 100){
                nData.splice(100, nData.length - 100);
            };
            this.commit('userOrder', nData);
        },
        sellData (state, data){
            state.sellData = data;
        },
        buyData (state, data){
            state.buyData = data;
        },
        xnbAssets (state, data){
            state.xnbAssets = data;
        },
        rmbAssets (state, data){
            state.rmbAssets = data;
        },
        assets (state, data){
            state.assets = data;
        },
        coins (state, data){
            state.coins = data;
        },
        markets (state, data){
            state.markets = data;
        },
        districtInfo (state, data){
            state.districtInfo = data;
        },
        clearDeal (state){
            state.deal = [];
            this.commit('nowPrice', null);
            this.commit('dealState', false);
            state.dealTeam = [];
        },
        deal (state, data){
                      
            data.forEach(function (item){
                if(item[4]){
                    item[4] = item[4] + '' + Math.ceil((Math.random() * 10000000));
                }else{
                    item[4] = Math.ceil((Math.random() * 100000000000))
                }
            })

            if(state.deal.length > 500){     //如果数据太大，删除多余数据  
                console.log('over')
                data.forEach(d=>{
                    state.deal.pop()
                })
            }            
            state.deal = data.concat(state.deal)
            this.commit('nowPrice', state.deal[0])
        },
        dealState (state, data){
            state.dealState = data;
            // if(data && !!!state.dealTeamTimer){
            //     var self = this;
            //     state.dealTeamTimer = setInterval(function (){
            //         if(state.dealTeam && Array.isArray(state.dealTeam) && state.dealTeam.length){
            //             var l = 1;
            //             if(state.dealTeam.length > 3){
            //                 l = state.dealTeam.length - 3;
            //             };
            //             if(state.deal.length >= 100){
            //                 state.deal.splice(-1, l);
            //             };
            //             for (var i = 0; i < l; i++){
            //                 state.deal.unshift(state.dealTeam[0]);
            //                 state.dealTeam.splice(0, 1);
            //             };
            //             self.commit('nowPrice', state.deal[0])
            //         }else{
            //             if(state.dealTeamTimer){
            //                 clearInterval(state.dealTeamTimer);
            //                 state.dealTeamTimer = null;
            //             };
            //         };
            //     }, 400);
            // }else{
            //     if(state.dealTeamTimer){
            //         state.dealTeamTimer = null;
            //         clearInterval(state.dealTeamTimer);
            //     };
            // };
        },
        dealTeam (state, data){
            this.commit('deal', data);
            // if(!!!state.dealTeamTimer){
            //     this.commit('dealState', true);
            // };
        },
        clearDepth (state, val){
            this.commit('depthState', false);
            this.commit('depthSell', []);
            this.commit('depthBuy', []);
        },
        upDepthSell (state, data){
            var depthSellKey = Object.assign({}, state.depthSellKey);
            var o = depth(data, depthSellKey);
            state.depthSell = o.d;
            state.depthSellKey = o.k;
        },
        depthSell (state, data){
            var depthSellKey = {};
            var o = depth(data, depthSellKey);
            state.depthSellKey = o.k;
            state.depthSell = o.d;
        },
        upDepthBuy (state, data){
            var depthBuyKey = Object.assign({}, state.depthBuyKey);
            var o = depth(data, depthBuyKey, 'buy');
            state.depthBuy = o.d;
            state.depthBuyKey = o.k;
        },
        depthBuy (state, data){
            var depthBuyKey = {};
            var o = depth(data, depthBuyKey, 'buy');
            state.depthBuyKey = o.k;
            state.depthBuy = o.d;
        },
        depthState (state, data){
            state.depthState = data;
        },
        ...commonState.mutations,
    },
    modules : {
        ...commonState.modules
    },
})
