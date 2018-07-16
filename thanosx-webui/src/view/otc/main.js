import Vue from 'vue'
import App from './App'

import store from './store'

import router from './router/index'

import module from '../../common/module'

import otcCss from "./assets/css/otc.scss";

import {apiOTC} from '../../common/api/otc'
import {mapState} from 'vuex'
store.commit('updateApi', apiOTC);

import orderDetails from './components/orderDetails'
import otcMenu from './components/menu';
Vue.component('otcMenu', otcMenu);
Vue.component('orderDetails', orderDetails);

Vue.mixin({
    data (){
        return {

        }
    },
    computed : {
        ...mapState(['shopData', 'shopCoin'])
    },
    methods : {
        orderStatusText (status){
            return status == 0 ? this.lang.otc54 : status == 3 ? this.lang.otc55 : status == 1 ? this.lang.otc56 : status == 2 ? this.lang.otc57 : this.lang.otc58;
        },
    }
});

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
