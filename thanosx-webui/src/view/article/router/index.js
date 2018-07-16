import Vue from 'vue'
import Router from 'vue-router'

import list from '../components/list'
import commonRouter from '../../../common/router'
import {toUrl} from "../../../common/api/api";

Vue.use(Router);
const router = new Router({
    mode: 'history',
    base : toUrl.articleUrl,
    routes: [
        {
            path: '/',
            redirect: '/36'
        },
        {
            path: '/:id/:pid?',
            name: 'list',
            component: list
        },
        ...commonRouter,
    ],
});
export default router
