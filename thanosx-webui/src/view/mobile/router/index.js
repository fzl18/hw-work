import Vue from 'vue'
import Router from 'vue-router'

import commonRouter from '../../../common/router'

import appDownload from '../components/appDownload'

import {toUrl} from "../../../common/api/api";

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base : toUrl.mobileUrl,
    routes: [
        {
            path: '/',
            redirect: '/appDownload'
        },
        {
            path: '/appDownload',
            name: 'appDownload',
            component: appDownload
        },
        ...commonRouter,
    ]
});

router.beforeEach((to, from, next) => {
    next();
});

export default  router
