import Vue from 'vue'
import App from './App'
import router from './router/index'

import module from '../../common/module'
import store from './store/index'

import  articleCss from "./assets/css/article.scss"

import {mapState} from "vuex"

import {apiArticle} from "../../common/api/article"
store.commit('updateApi', apiArticle);

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
