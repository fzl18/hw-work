import Vue from 'vue'
import App from './App'

import store from './store'

import router from './router/index'

import module from '../../common/module'

import safetyCss from "./assets/css/safety.scss";

import {apiSafety} from '../../common/api/safety'

import {mapState} from 'vuex'

store.commit('updateApi', apiSafety);

Vue.mixin({
    data (){
        return {
            verifTipTime : 3000,
        }
    },
    computed : {
        ...mapState(['userBasicinfo', 'userBasicinfoState'])
    },
    methods : {
        basicinfo (){
            this.$store.commit('userBasicinfoState', 0);
            this.axios({
                url : this.api.basicinfo,
            }).then((res) => {
                this.$store.commit('userBasicinfo', res.data);
                this.$store.commit('userBasicinfoState', 1);
            }).catch((err) => {
                this.$store.commit('userBasicinfoState', -1);
                this.$store.commit('userBasicinfo', {});
                this.basicinfo();
            });
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
