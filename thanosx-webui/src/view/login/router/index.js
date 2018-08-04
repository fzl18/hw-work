import Vue from 'vue'
import Router from 'vue-router'

import commonRouter from '../../../common/router'

import login from '../components/login'
import register from '../components/register'
import resetPassword from '../components/resetPassword'
// import radarLogin from '../components/radarLogin'

import store from '../store/index';
import {toUrl} from "../../../common/api/api";

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base : toUrl.loginUrl,
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/register/:invite?',
            name: 'register',
            component: register
        },
        {
            path: '/resetPassword',
            name: 'resetPassword',
            component: resetPassword
        },
        // {
        //     path: '/radarLogin',
        //     name: 'radarLogin',
        //     component: radarLogin
        // },
        ...commonRouter,
    ]
});

router.beforeEach((to, from, next) => {
    store.commit('tips/delAll');
    next();
});

export default  router
