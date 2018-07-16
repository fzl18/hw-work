import Vue from 'vue';
import Vuex from 'vuex';

import tips from '../../../store/tips';
import commonState from '../../../common/store'

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        ...commonState.state
    },
    actions : {
        ...commonState.actions,
    },
    mutations : {
        ...commonState.mutations,
    },
    modules : {
        tips,
        ...commonState.modules
    },
    strict: process.env.NODE_ENV !== 'production'
})
