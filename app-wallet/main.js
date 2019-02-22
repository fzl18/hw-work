import Vue from 'vue'
import App from './App'
import store from './store'
import http from './common/http'
import chainAPI from 'bvcadt-crypto'
import config from './common/config'
Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.prototype.chainAPI = chainAPI
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
