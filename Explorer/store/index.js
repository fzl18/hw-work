import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import lang from "../lang/index"
Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: {
      lang:'cn',
      local:lang,
      searchKey:'',
      token:'',
      account:'',
      hash:''
    },
    mutations
  })
}

export default createStore