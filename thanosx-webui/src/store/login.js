
const state = {
    loginStatus : false,
    loginGetStatus : false,
    loginInfo : {},
    nameauthStatus:0,
    restLogin:false,
};

const getters = {

};

const actions = {

};

const mutations = {
    loginInfo (state, param){

        if(typeof param == 'object'){
            state.loginInfo = param.uid ? param : {uid:'', username:''};
        }else{
            state.loginInfo = {uid:'', username:''};
        };
    },
    loginStatus (state, val){
        state.loginStatus = val;
    },
    loginGetStatus (state, val){
        state.loginGetStatus = val;
    },
    nameauthStatus (state, val){
        state.nameauthStatus = val;
    },
    restLogin (state, val){
        state.restLogin = val;
    },
};

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}
