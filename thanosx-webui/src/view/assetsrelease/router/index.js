import Vue from 'vue'
import Router from 'vue-router'

import list from '../components/list'
import info from '../components/info'
import commonRouter from '../../../common/router'
import {toUrl} from "../../../common/api/api";

Vue.use(Router);
const router = new Router({
    mode: 'history',
    base : toUrl.assetsreleaseUrl,
    routes: [
        {
            path: '/',
            name: 'list',
            component: list
        },
        {
            path: '/:xnb/:id',
            name: 'info',
            component: info
        },
        ...commonRouter,
    ],
});
export default router
