import Vue from 'vue'
import Router from 'vue-router'

import index from '../components/index'
import shop from '../components/shop'
import order from '../components/order'
import applyShop from '../components/applyShop'

import commonRouter from "../../../common/router";

Vue.use(Router);

import {toUrl} from '../../../common/api/api'

const router = new Router({
    mode: 'history',
    base : toUrl.otcUrl,
    routes: [
        {
            path: '/(index)?',
            redirect: '/index/cnt/buy'
        },
        {
            path: '/index/:coin/:type',
            name: 'index',
            component: index,
        },
        {
            path: '/shop',
            name: 'shop',
            component: shop,
        },
        {
            path: '/order',
            redirect: '/order/0/1'
        },
        {
            path: '/order/:type',
            redirect: '/order/:type/1'
        },
        {
            path: '/order/:type/:page',
            name: 'order',
            component: order,
        },
        {
            path: '/applyShop',
            name: 'applyShop',
            component: applyShop,
        },
        ...commonRouter,
    ]
});

router.beforeEach((to, from, next) => {
    next();
});

export default  router
