import Vue from 'vue'
import App from './App'
import router from './router/index'

import module from '../../common/module'
import store from './store/index'

import  c2c from "./assets/css/c2c.scss"

import {mapState} from "vuex"

import {apiC2c} from "../../common/api/c2c"
store.commit('updateApi', apiC2c);

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
