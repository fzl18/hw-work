import Vue from 'vue';
import Vuex from 'vuex';

import commonState from '../../../common/store'

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        coins : {},
        noticeData : {},
        noticeSelf : {},
        districtInfo : {},
        markets : [],
        marketData : {},
        marketsShowStatus : false,
        ...commonState.state
    },
    actions : {
        ...commonState.actions,
    },
    mutations : {
        marketsShowStatus (state, data){
            state.marketsShowStatus = data;
        },
        noticeSelf (state, data){
            state.noticeSelf = data;
        },
        noticeData (state, data){
            state.noticeData = data;
        },
        coins (state, data){
            state.coins = data;
        },
        marketData (state, data){
            state.marketData = data;
        },
        districtInfo (state, data){
            state.districtInfo = data;
        },
        markets (state, data){
            state.markets = data;
        },
        ...commonState.mutations,
    },
    modules : {
        ...commonState.modules
    },
    strict: process.env.NODE_ENV !== 'production'
})
