import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'
import commonRouter from '../../../common/router'
import {toUrl} from "../../../common/api/api";
Vue.use(Router);

const router = new Router({
    mode: 'history',
    base : toUrl.tradeUrl,
    routes: [
        {
            path: '/',
            redirect: '/eth/usdt'
        },
        {
            path: '/:xnb/:rmb',
            name: 'index',
            component: index
        },
        ...commonRouter,
    ]
});
export default router
