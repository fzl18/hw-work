import Vue from 'vue'
import App from './App'

import router from './router/index'
import store from './store/index'

import module from '../../common/module'

import financeCss from "./assets/css/finance.scss";

import {mapState} from "vuex";

import {apiFinance} from "../../common/api/finance";
store.commit('updateApi', apiFinance);

import financeHeader from './components/header';
import balance from './components/balance';
Vue.component('financeHeader', financeHeader);
Vue.component('balance', balance);

Vue.mixin({
    data (){
        return {
        }
    },
    computed : {
    },
    methods : {
        coinChange (){
            if(this.$route.query.coin){
                this.coin = this.$route.query.coin
            }else{
                this.$router.push('./index');
            };
        },
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
