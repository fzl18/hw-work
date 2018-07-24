import Vue from 'vue'
import App from './App'
import store from './store'
import module from '../../common/module'

import {apiHome} from '../../common/api/home'
import 'babel-polyfill'
store.commit('updateApi', apiHome)

Vue.mixin({
    data (){
        return {
            animateClass : '',
        }
    },
    methods : {
        scroll (scrollTop, app, appTop, self, enterCallback, exitCallback){
            if((scrollTop + window.innerHeight) >= appTop){
                if(scrollTop > appTop + app.clientHeight){
                    self.animateClass = '';
                    exitCallback();
                }else{
                    self.animateClass = 'active';
                    enterCallback();
                }
            }else{
                self.animateClass = '';
                exitCallback();
            };
        },
        startScroll (cls, enterCallback, exitCallback){
            var self = this;
            var app = document.querySelector(cls);
            var appTop = app.offsetTop;
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            enterCallback = enterCallback || function () {};
            exitCallback = exitCallback || function () {};
            window.addEventListener("scroll", function (){
                appTop = app.offsetTop;
                scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                self.scroll(scrollTop, app, appTop, self, enterCallback, exitCallback);
            }, false);
            self.scroll(scrollTop, app, appTop, self, enterCallback, exitCallback);
        }
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    components: { App },
    template: '<App/>'
})
