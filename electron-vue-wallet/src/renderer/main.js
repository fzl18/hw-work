import Vue from 'vue'
import axios from 'axios'
import iview from 'iview'
import App from './App'
import router from './router'
import store from './store'
import './common/mixin'
import 'iview/dist/styles/iview.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(iview)
Vue.http = Vue.prototype.$http = Vue.prototype.axios = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
