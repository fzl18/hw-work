import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import {Lang} from './lang'
import axios from './common/axios'
import {LoadingBar, Message, Notice } from 'iview'
import VueClipboard from 'vue-clipboard2'
import 'iview/dist/styles/iview.css'
import './assets/css/main.less'
Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(VueClipboard)
LoadingBar.config({
  color: '#e4526d',
  failedColor: '#f0ad4e',
});
Vue.prototype.$Loading = LoadingBar
Vue.prototype.$Message = Message
Vue.prototype.$Notice = Notice
Vue.prototype.$axios = axios

const i18n = new VueI18n({
  locale: localStorage.Lang ||'en',
  messages:{
    ...Lang
  }
})


router.beforeEach((to, from, next) => {
  LoadingBar.start();
  next();
});

router.afterEach(route => {
  LoadingBar.finish();
});


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
