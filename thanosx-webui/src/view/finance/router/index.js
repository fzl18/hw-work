import Vue from 'vue'
import Router from 'vue-router'

import commonRouter from '../../../common/router'

import index from '../components/index'
import myBankCard from '../components/myBankCard'
import myDeal from '../components/myDeal'
import myEntrust from '../components/myEntrust'
import myPay from '../components/myPay'
import myWallet from '../components/myWallet'
import addAlipay from '../components/addAlipay'
import addWeChat from '../components/addWeChat'
import addWallet from '../components/addWallet'
import addBankCard from '../components/addBankCard'

import takeCoin from '../components/takeCoin'
import pushCoin from '../components/pushCoin'
import transferCoin from '../components/transferCoin'
import coinRecord from '../components/coinRecord'
import inviteFriends from '../components/inviteFriends'
import mapDel from '../components/mapDel'

import {toUrl} from "../../../common/api/api";

Vue.use(Router)

export default new Router({
    mode: 'history',
    base : toUrl.financeUrl,
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: index,
        },
        {
            path: '/takeCoin',
            name: 'takeCoin',
            component: takeCoin,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/transferCoin',
            name: 'transferCoin',
            component: transferCoin,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/coinRecord',
            name: 'coinRecord',
            component: coinRecord,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/pushCoin',
            name: 'pushCoin',
            component: pushCoin,
            meta : {
                parent : 'index'
            }
        },
        {
            path: '/myBankCard',
            name: 'myBankCard',
            component: myBankCard
        },
        {
            path: '/myDeal',
            name: 'myDeal',
            component: myDeal
        },
        {
            path: '/myEntrust',
            name: 'myEntrust',
            component: myEntrust
        },
        {
            path: '/myPay',
            name: 'myPay',
            component: myPay
        },
        {
            path: '/myWallet',
            name: 'myWallet',
            component: myWallet
        },
        {
            path: '/addAlipay',
            name: 'addAlipay',
            component: addAlipay,
            meta : {
                parent : 'myPay'
            }
        },
        {
            path: '/addWeChat',
            name: 'addWeChat',
            component: addWeChat,
            meta : {
                parent : 'myPay'
            }
        },
        {
            path: '/addWallet',
            name: 'addWallet',
            component: addWallet,
            meta : {
                parent : 'myWallet'
            }
        },
        {
            path: '/addBankCard',
            name: 'addBankCard',
            component: addBankCard,
            meta : {
                parent : 'myBankCard'
            }
        },
        {
            path: '/inviteFriends',
            name: 'inviteFriends',
            component: inviteFriends,
        },
        {
            path: '/mapDel',
            name: 'mapDel',
            component: mapDel,
            meta : {
                parent : 'index'
            }
        },
        ...commonRouter,
    ]
})
