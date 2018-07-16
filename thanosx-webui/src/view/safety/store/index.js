import Vue from 'vue';
import Vuex from 'vuex';

import commonState from '../../../common/store'

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        userBasicinfoState : -1,
        userBasicinfo : {},
        ...commonState.state
    },
    getters : {
        userBasicinfo (state){
            return state.userBasicinfo;
        }
    },
    actions : {
        ...commonState.actions,
    },
    mutations : {
        ...commonState.mutations,
        userBasicinfo (state, param){
            if(typeof param == 'object'){
                state.userBasicinfo = param;
            }else{
                state.userBasicinfo = {};
            };
        },
        userBasicinfoState (state, param){
            state.userBasicinfoState = param;
        }
    },
    modules : {
        ...commonState.modules
    },
})
