import Vue from 'vue'
import App from './App'
import router from './router/index'

import module from '../../common/module'
import store from './store/index'

import  icoCss from "./assets/css/ico.scss"

import {mapState} from "vuex"

import {apiIco} from "../../common/api/assetsrelease"
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
router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
  })
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
