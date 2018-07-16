import Vue from 'vue'
import App from './App'
import router from './router/index'

import store from './store'
import module from '../../common/module'
import css from "./assets/css/mobile.scss";

Vue.mixin({
    data (){
        return {
        }
    },
    computed : {
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
