
import login from "../store/login"
import msg from "../store/msg"
import lang from "./lang/index"
import {apiCommon, apiStatus, webSocketUrl, toUrl} from './api/api'
const type = navigator.appName
let local = 'zh'
let langtype
if (type == "Netscape"){
　　langtype = navigator.language
}else{
　　langtype = navigator.userLanguage
};
if(!localStorage.curLang){
    if (langtype == "zh-CN" || langtype == "zh"){
        local="zh"
    }else if(langtype == "zh-TW"){
        local="zhtw"
    }else{
        local="en"
    }
}else{
    local = localStorage.curLang
}


export default {
    state : {
        lang,
        local,
        headerActive : '',
        api : apiCommon,
        mobile : 0,
        apiStatus,
        webSocketUrl,
        verifyCodeTime : 60,
        verifCodeLen : 6,
        areaDecimals : {
            cnt : 2,
            pyc : 4,
            usdt : 6,
            btc : 8,
            eth : 6,
            wbc : 4,
        },
        passwordMinLen : 8,
        passwordMaxLen : 32,
        ...toUrl
    },
    getters : {
    },
    actions : {
    },
    mutations : {
        mobile (state, param){
            state.mobile = param;
        },
        updateApi (state, param){
            state.api = Object.assign({}, state.api, param);
        },
        headerActive (state, headerActive){
            state.headerActive = headerActive;
        },
        changeLang (state,param){
            state.local = param
            window.localStorage.curLang = param
        }
    },
    modules : {
        login,
        msg
    },
    strict: process.env.NODE_ENV !== 'production'
}
