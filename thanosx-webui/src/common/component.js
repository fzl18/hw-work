import Vue from 'vue';

import headerComponent from '../components/head';
import footerComponent from '../components/foot';
// import topComponent from '../components/top';
import load from '../components/load';
import loadError from '../components/loadError';
import emptyData from '../components/emptyData';
import tips from '../components/tips';
import msg from '../components/msg';
import page from '../components/page';
import selectMy from '../components/selectMy';
import list from '../components/list';
import listLoadTemplate from '../components/listLoadTemplate';
import uploadFile from '../components/uploadFile';
import appDownload from '../components/appDownload';
import { Row, Col,Dropdown,DropdownMenu,DropdownItem,Icon,Affix,Modal } from 'iview';

const copy = () => import(/* webpackChunkName: "copy" */ '../components/copy');
const ewm = () => import(/* webpackChunkName: "ewm" */ '../components/ewm');

Vue.component('headerComponent', headerComponent);
Vue.component('footerComponent', footerComponent);
// Vue.component('topComponent', topComponent);
Vue.component('load', load);
Vue.component('loadError', loadError);
Vue.component('emptyData', emptyData);
Vue.component('tips', tips);
Vue.component('msg', msg);
Vue.component('page', page);
Vue.component('selectMy', selectMy);
Vue.component('list', list);
Vue.component('listLoadTemplate', listLoadTemplate);
Vue.component('uploadFile', uploadFile);
Vue.component('appDownload', appDownload);
Vue.component('copy', copy);
Vue.component('ewm', ewm);

Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Icon', Icon);
Vue.component('Affix', Affix);
Vue.component('Modal', Modal);
