import Vue from 'vue'
import vueCookies  from 'vue-cookies'
import axios  from './axios'
import VueAxios from 'vue-axios'
import animate from 'animate.css'
import 'iview/dist/styles/iview.css'

Vue.use(vueCookies);
Vue.use(VueAxios, axios);

import mixin from './mixin'
import component from './component'
import commonCss from '../assets/css/common.scss'

const isDebug_mode = process.env.NODE_ENV !== 'production';
Vue.config.debug = isDebug_mode;
Vue.config.devtools = false;
Vue.config.productionTip = false;






