import Vue from 'vue'
import Vuex from 'vuex'
const currentWalletIndex = uni.getStorageSync('currentWalletIndex') || 0
const walletList = uni.getStorageSync('walletList') || []
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		currentWalletIndex,
		lang:'',
		walletList,
		openid: null
	},
	mutations: {
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
		editWallet(state,index,data){
			state.walletList.splice(index,1,data)
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
