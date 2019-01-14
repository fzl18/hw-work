import config from '../../config'
const state = {
  hasLogin: false,
  config,
  useLang:config.useLang
}

const mutations = {
  HANDLE_LOGIN (state,val) {
    state.hasLogin = val
  },
  CHANGE_LANG (state,val){
    state.useLang = val
  }
}

const actions = {
  isLogin ({ commit },val) {
    commit('HANDLE_LOGIN',val)
  },
  changeLang ({ commit },val) {
    commit('CHANGE_LANG',val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
