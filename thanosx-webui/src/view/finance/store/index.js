import Vue from 'vue';
import Vuex from 'vuex';

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
        ...commonState.modules
    },
})
