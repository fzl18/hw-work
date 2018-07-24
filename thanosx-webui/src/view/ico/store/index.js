import Vue from 'vue';
import Vuex from 'vuex';

import commonState from '../../../common/store'

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        info : {},
        activeObject : {},
        ...commonState.state
    },
    actions : {
        ...commonState.actions,
    },
    mutations : {
        activeObject (state, activeObject){
            state.activeObject = activeObject;
        },
        info (state, info){
            state.info = info;
        },
        ...commonState.mutations,
    },
    modules : {
        ...commonState.modules
    },
})
