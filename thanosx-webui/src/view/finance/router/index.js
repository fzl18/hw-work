import Vue from 'vue'
import Router from 'vue-router'
import axios from '../../../common/axios'
import commonRouter from '../../../common/router'

import index from '../components/index'
import myBankCard from '../components/myBankCard'
import myDeal from '../components/myDeal'
import myEntrust from '../components/myEntrust'
// import myPay from '../components/myPay'
import myWallet from '../components/myWallet'
import addAlipay from '../components/addAlipay'
import addWeChat from '../components/addWeChat'
import addWallet from '../components/addWallet'
import addBankCard from '../components/addBankCard'

import takeCoin from '../components/takeCoin'
import pushCoin from '../components/pushCoin'
import transferCoin from '../components/transferCoin'
import coinRecord from '../components/coinRecord'
// import inviteFriends from '../components/inviteFriends'
import mapDel from '../components/mapDel'


import account from '../components/account'
import issue from '../components/issue'
import upTradePassword from '../components/upTradePassword'
import setTradePassword from '../components/setTradePassword'
import findTradePassword from '../components/findTradePassword'
import uppassword from '../components/uppassword'

const ga = () => import(/* webpackChunkName: "ga" */ '../components/ga')
const gaRemove = () => import(/* webpackChunkName: "ga" */ '../components/gaRemove')
const gaSet = () => import(/* webpackChunkName: "ga" */ '../components/gaSet')

import nameAuth from '../components/nameAuth'
import nameAuthDetails from '../components/nameAuthDetails'
import mobileBind from '../components/mobileBind'

import setRsa from '../components/setRsa'

import store from '../store/index'
import {toUrl} from "../../../common/api/api";
import {apiFinance} from '../../../common/api/finance'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    base : toUrl.financeUrl,
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: index,
        },
        {
            path: '/takeCoin',
            name: 'takeCoin',
            component: takeCoin,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/transferCoin',
            name: 'transferCoin',
            component: transferCoin,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/coinRecord',
            name: 'coinRecord',
            component: coinRecord,
            meta : {
                parent : 'coinRecord'
            }
        },
        {
            path: '/pushCoin',
            name: 'pushCoin',
            component: pushCoin,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/myBankCard',
            name: 'myBankCard',
            component: myBankCard
        },
        {
            path: '/myDeal',
            name: 'myDeal',
            component: myDeal
        },
        {
            path: '/myEntrust',
            name: 'myEntrust',
            component: myEntrust
        },
        // {
        //     path: '/myPay',
        //     name: 'myPay',
        //     component: myPay
        // },
        {
            path: '/myWallet',
            name: 'myWallet',
            component: myWallet
        },
        // {
        //     path: '/addAlipay',
        //     name: 'addAlipay',
        //     component: addAlipay,
        //     meta : {
        //         parent : 'myPay'
        //     }
        // },
        // {
        //     path: '/addWeChat',
        //     name: 'addWeChat',
        //     component: addWeChat,
        //     meta : {
        //         parent : 'myPay'
        //     }
        // },
        {
            path: '/addWallet',
            name: 'addWallet',
            component: addWallet,
            meta : {
                parent : 'myWallet'
            }
        },
        {
            path: '/addBankCard',
            name: 'addBankCard',
            component: addBankCard,
            meta : {
                parent : 'myBankCard'
            }
        },
        // {
        //     path: '/inviteFriends',
        //     name: 'inviteFriends',
        //     component: inviteFriends,
        // },
        {
            path: '/mapDel',
            name: 'mapDel',
            component: mapDel,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/account',
            name: 'account',
            component: account,
        },
        {
            path: '/issue',
            name: 'issue',
            component: issue,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/upTradePassword',
            name: 'upTradePassword',
            component: upTradePassword,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/setTradePassword',
            name: 'setTradePassword',
            component: setTradePassword,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/findTradePassword',
            name: 'findTradePassword',
            component: findTradePassword,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/uppassword',
            name: 'uppassword',
            component: uppassword,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/ga',
            name: 'ga',
            component: ga,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/gaRemove',
            name: 'gaRemove',
            component: gaRemove,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/gaSet',
            name: 'gaSet',
            component: gaSet,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/nameAuth',
            name: 'nameAuth',
            component: nameAuth,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/nameAuthDetails',
            name: 'nameAuthDetails',
            component: nameAuthDetails,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/mobileBind',
            name: 'mobileBind',
            component: mobileBind,
            meta : {
                parent : 'account'
            }
        },
        {
            path: '/setRsa',
            name: 'setRsa',
            component: setRsa,
            meta : {
                parent : 'account'
            }
        },
        ...commonRouter,
    ]
})




const routeGuard = function (to, from, next){
    if(to.name == 'index'){
        next();
        return true;
    };

    var userBasicinfo = store.getters.userBasicinfo;
    if(userBasicinfo && userBasicinfo.userid){
        if(to.name == 'issue'){
            if(userBasicinfo.questionid){
                next('./');
            }else{
                next();
            };
            return;
        };
        if(to.name == 'upTradePassword' || to.name == 'findTradePassword'){
            if(userBasicinfo.paypassword){
                next('./setTradePassword');
            }else{
                next('./setTradePassword');
            };
            return;
        };
        if(to.name == 'setTradePassword'){
            if(userBasicinfo.paypassword){
                next();
            }else{
                next();
            };
            return;
        };
       
        if(to.name == 'ga'){
            if(userBasicinfo.gabind){
                next('./gaRemove');
            }else{
                next();
            };
            return;
        };
        // if(to.name == 'gaRemove' || to.name == 'gaSet' ){
        //     if(userBasicinfo.gabind){
        //         next();
        //     }else{
        //         next('./ga');
        //     };
        //     return;
        // };
        // if(to.name == 'mobileBind'){
        //     if(userBasicinfo.moble){
        //         next('./mobileBind');
        //     }else{
        //         next();
        //     };
        //     return;
        // };
        if(to.name == 'nameAuth'){
            if(userBasicinfo.nameauthstatus == '1'){
                next('./nameAuthDetails');
            }else{
                next();
            };
            return;
        };
        if(to.name == 'nameAuthDetails'){
            if(userBasicinfo.truename){
                next();
            }else{
                next('./nameAuth');
            };
            return;
        };
        if(to.name == 'nameAuthDetails'){
            if(userBasicinfo.truename){
                next();
            }else{
                next('./nameAuth');
            };
            return;
        };
        next();
    }else{
        basicinfo(routeGuard, to, from, next);
    }
};


var basicinfoNum = 0;
const basicinfo = function (routeGuard, to, from, next){
    // console.log('router basicinfo');
    store.commit('userBasicinfoState', 0);
    basicinfoNum ++;
    axios({
        url : apiFinance.basicinfo,
    }).then((res) => {
        store.commit('userBasicinfo', res.data);
        store.commit('userBasicinfoState', 1);
        routeGuard(to, from, next);
    }).catch((err) => {
        store.commit('userBasicinfoState', -1);
        store.commit('userBasicinfo', {});
        if(basicinfoNum < 5){
            basicinfo(routeGuard);
        };
    });
};

router.beforeEach((to, from, next) => {
    routeGuard(to, from, next);
});


export default  router