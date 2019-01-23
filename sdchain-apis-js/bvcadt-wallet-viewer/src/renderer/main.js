import Vue from 'vue'
import axios from 'axios'
import iview from 'iview'
import App from './App'
import router from './router'
import store from './store'
import config from './config'
import VueClipboard from 'vue-clipboard2'
import './common/mixin'
import 'iview/dist/styles/iview.css'
if (!config.isWeb) Vue.use(require('vue-electron'))
Vue.use(iview)
Vue.use(VueClipboard)
Vue.http = Vue.prototype.$http = Vue.prototype.axios = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>',
}).$mount('#app')
