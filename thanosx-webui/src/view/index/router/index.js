import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
    routes:[],
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (to.hash) {
          return {
            selector: to.hash
          }
        }
      }
  })


export default  router
