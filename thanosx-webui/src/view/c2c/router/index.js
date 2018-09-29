import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'
import apply from '../components/apply'
import biz from '../components/biz'
import commonRouter from '../../../common/router'
import {toUrl} from "../../../common/api/api";

Vue.use(Router);
const router = new Router({
    mode: 'history',
    base : toUrl.c2cUrl,
    routes: [
        {
            path: '/',
            name: 'index',
            component: index
        },
        {
            path: '/apply',
            name: 'apply',
            component: apply
        },
        {
            path: '/biz',
            name: 'biz',
            component: biz
        },
        ...commonRouter,
    ],
});
export default router
