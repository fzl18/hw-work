import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import module from '../../common/module'

import {apiTrade} from '../../common/api/trade'

store.commit('updateApi', apiTrade);

import tradeCss from "./assets/css/trade.scss";
import {mapState} from "vuex";

Vue.mixin({
    data (){
        return {
            serviceCharge : 0,
        }
    },
    computed : {
        ...mapState(['xnb', 'rmb', 'coins', 'districtInfo', 'markets']),
        rmbLen (){
            return ((this.coins[this.rmb] && this.coins[this.rmb].accuracy) || 4);
        },
        xnbLen (){
            return ((this.coins[this.xnb] && this.coins[this.xnb].accuracy) || 4);
        },
    },
    methods : {
        numSplit (num, len){
            num = num + '';
            if(/\./.test(num)){
                return num.replace(eval('/([0-9]+\\.[0-9]{1,' + len + '})(.*)/g'),"$1");
            };
            return num;
        },
        rmbSplit (num){
            console.log('rmb:',this.rmbLen)
            return this.numSplit(num, this.rmbLen);
        },
        xnbSplit (num){
            console.log('xnb:',this.xnbLen)
            return this.numSplit(num, this.xnbLen);
        },
        priceAccuracy (val){
            return  parseFloat(this.toDecimals(val, this.rmbLen))
        },
        numAccuracy (val){            
            return parseFloat(this.toDecimals(val, this.xnbLen))
        },
        decimals (val){
            return (val + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".");
        },
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
