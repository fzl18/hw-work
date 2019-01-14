import Vue from 'vue'
import {mapState,mapActions} from 'vuex'
import chainAPI from 'bvcadt-crypto'
import {Lang,LangList } from '../lang'
const computed = {
    ...mapState('login',['hasLogin','useLang','config']),
    chainAPI(){
        return new chainAPI()
    },
    Lang(){
        return Lang
    },
    LangList(){
        return LangList
    }
}
const methods = {
    ...mapActions('login',['isLogin','changeLang'])
}

Vue.mixin({computed,methods})