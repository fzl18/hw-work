import Vue from 'vue'
import Vuex from 'vuex'
import lang from '../lang'
const currentWalletIndex = uni.getStorageSync('currentWalletIndex') || 0
const walletList = uni.getStorageSync('walletList') || []
const locale=uni.getStorageSync('locale') || ((uni.getSystemInfoSync().language=='zh_CN'||uni.getSystemInfoSync().language=='zh_TW')?'cn':'en') || 'cn'
const currentLangIndex=uni.getStorageSync('currentLangIndex') || 0
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		currentWalletIndex,
		lang,
		locale,
		currentLangIndex,
		walletList,
		openid: null,
		refresh:false,
	},
	mutations: {
		setRefresh(state, status){
			state.refresh = status
		},
		setCurWalletIndex(state, index){
			state.currentWalletIndex = index			
		},
		setWalletList(state, list) {
			state.walletList = list
		},
		addWallet(state,oj){
			state.walletList.push(oj)
		},
		delWallet(state,index){
			state.walletList.splice(index,1)
		},
		editWallet(state,oj){
			state.walletList.splice(oj.index,1,oj.list)
		},
		setLocale(state,loc){
			state.locale=loc;
		},
		setCurrentLangIndex(state,langIndex){
			state.currentLangIndex=langIndex;
		}
	},
	actions: {
		// lazy loading openid
		getUserOpenId: async function ({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function () { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' + openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
