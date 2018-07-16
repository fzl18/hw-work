import Vue from 'vue';
import Vuex from 'vuex';

import commonState from '../../../common/store'

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        shopCoin : {},
        shopData : {},
        shopDataUpdate : 1,
        ...commonState.state
    },
    getters : {
        ...commonState.getters,
    },
    actions : {
        ...commonState.actions,
    },
    mutations : {
        shopDataUpdate (state){
            state.shopDataUpdate = state.shopDataUpdate + 1;
        },
        shopData (state, obj){
            state.shopData = typeof obj == 'object' ? obj : {};
        },
        shopCoin (state, obj){
            state.shopCoin = typeof obj == 'object' ? obj : {};
        },
        ...commonState.mutations,
    },
    modules : {
        ...commonState.modules
    },
})
