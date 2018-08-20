import Vue from 'vue'
import Router from 'vue-router'
import {toUrl} from "../../../common/api/api";
import index from '../components/index';
import prohibit from '../../../components/prohibit';
Vue.use(Router);
console.log(toUrl.indexUrl)
const router = new Router({    
    mode: 'history',
    base : toUrl.indexUrl,
    routes:[
      {
        path: '/',
        name: 'index',
        component: index
      },
      {
        path: '/prohibit',
        name: 'prohibit',
        component: prohibit
      },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (to.hash) {
          return {
            selector: to.hash
          }
        }
      }
  })


export default  router
