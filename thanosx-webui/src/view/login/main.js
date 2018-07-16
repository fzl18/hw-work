import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
import module from '../../common/module'
import {apiLogin} from '../../common/api/login'
import css from "./assets/css/login.scss"
store.commit('updateApi', apiLogin)
Vue.mixin({
    data (){
        return {
            verifTipTime : 3000,
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
