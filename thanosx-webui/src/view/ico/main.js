import Vue from 'vue'
import App from './App'
import router from './router/index'

import module from '../../common/module'
import store from './store/index'

import  icoCss from "./assets/css/ico.scss"

import {mapState} from "vuex"

import {apiIco} from "../../common/api/ico"
store.commit('updateApi', apiIco);

Vue.mixin({
    data (){
        return {
        }
    },
    computed : {
        ...mapState(['info']),
    },
    methods : {

    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
