import Vue from 'vue'
import Router from 'vue-router'

import index from '../components/index'
import issue from '../components/issue'
import upTradePassword from '../components/upTradePassword'
import setTradePassword from '../components/setTradePassword'
import findTradePassword from '../components/findTradePassword'
import uppassword from '../components/uppassword'

import {toUrl} from '../../../common/api/api'
import {apiSafety} from '../../../common/api/safety'
import axios from '../../../common/axios'
import commonRouter from "../../../common/router";

const ga = () => import(/* webpackChunkName: "ga" */ '../components/ga')
const gaRemove = () => import(/* webpackChunkName: "ga" */ '../components/gaRemove')
const gaSet = () => import(/* webpackChunkName: "ga" */ '../components/gaSet')

import nameAuth from '../components/nameAuth'
import nameAuthDetails from '../components/nameAuthDetails'
import mobileBind from '../components/mobileBind'

import store from '../store/index'
Vue.use(Router);

const router = new Router({
    mode: 'history',
    base : toUrl.safetyUrl,
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/issue',
            name: 'issue',
            component: issue
        },
        {
            path: '/upTradePassword',
            name: 'upTradePassword',
            component: upTradePassword
        },
        {
            path: '/setTradePassword',
            name: 'setTradePassword',
            component: setTradePassword
        },
        {
            path: '/findTradePassword',
            name: 'findTradePassword',
            component: findTradePassword
        },
        {
            path: '/uppassword',
            name: 'uppassword',
            component: uppassword
        },
        {
            path: '/ga',
            name: 'ga',
            component: ga
        },
        {
            path: '/gaRemove',
            name: 'gaRemove',
            component: gaRemove
        },
        {
            path: '/gaSet',
            name: 'gaSet',
            component: gaSet
        },
        {
            path: '/nameAuth',
            name: 'nameAuth',
            component: nameAuth
        },
        {
            path: '/nameAuthDetails',
            name: 'nameAuthDetails',
            component: nameAuthDetails
        },
        {
            path: '/mobileBind',
            name: 'mobileBind',
            component: mobileBind
        },
        ...commonRouter,
    ]
});


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
                next();
            }else{
                next('./setTradePassword');
            };
            return;
        };
        if(to.name == 'setTradePassword'){
            if(userBasicinfo.paypassword){
                next('./upTradePassword');
            }else{
                next();
            };
            return;
        };
        if(to.name == 'ga'){
            if(userBasicinfo.gabind){
                next('./gaSet');
            }else{
                next();
            };
            return;
        };
        if(to.name == 'gaRemove' || to.name == 'gaSet' ){
            if(userBasicinfo.gabind){
                next();
            }else{
                next('./ga');
            };
            return;
        };
        if(to.name == 'mobileBind'){
            if(userBasicinfo.moble){
                next('./');
            }else{
                next();
            };
            return;
        };
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
        url : apiSafety.basicinfo,
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
