import Vue from 'vue'
import {mapState,mapActions} from 'vuex'
import chainAPI from 'bvcadt-crypto'
import config from '../config'
import {Lang, LangList } from '../lang'
const computed = {
    ...mapState('login',['hasLogin','useLang']),
    chainAPI(){
        return chainAPI
    },
    Lang(){
        return Lang
    },
    LangList(){
        return LangList
    },
    config(){
        return config
    }
}
const methods = {
    ...mapActions('login',['isLogin','changeLang'])
}

Vue.mixin({computed, methods})