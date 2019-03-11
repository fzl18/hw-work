import Vue from 'vue'
import App from './App'
import store from './store'
import http from './common/http'
import VueI18n from 'vue-i18n'
// import chainAPI from 'bvcadt-crypto'
const chainAPI = require('bvcadt-crypto')
import config from './common/config'
Vue.prototype.$http = http 
Vue.prototype.$config = config
Vue.prototype.chainAPI = chainAPI
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.use(VueI18n)
App.mpType = 'app'
const app = new Vue({
    store,
    ...App
})
app.$mount()
