<template>
	<view class="addWallet uni-padding-wrap">
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate uni-navigate-right">							
							<input type="text" v-model="password" :placeholder="lang[locale].edit.placeholder"/>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate uni-navigate-right">							
							<input type="text" v-model="newPw" :placeholder="lang[locale].edit.placeholder2"/>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<input type="text" v-model="reNewPw" :placeholder="lang[locale].edit.placeholder3"/>							
						</view>
					</view>
				</view>
			</view>
		</view>

		<button type="primary" class="del" @tap="save">{{lang[locale].edit.btn}}</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				key:'',
				password:'',
				current:'',
				newPw:'',
				reNewPw:''
			}
		},
		onLoad(option) {
			this.current = option.index
		},
		computed:{
			...mapState(['walletList','currentWalletIndex','lang','locale'])
		},
		mounted(){
			uni.setNavigationBarTitle({
				title: this.lang[this.locale].edit.tit
			})
		},
		methods:{
			...mapMutations(['setCurWalletIndex','editWallet',]),
			save(){
				const { password, key, newPw, reNewPw, name, current, walletList, editWallet} = this
				let reg = /^([a-z0-9\@\!\#\$\%\^\&\*]){6,12}$/i
				if(!password.length){
					uni.showToast({title:this.lang[this.locale].edit.toast,icon:'none'})
					return
				}
				if(password != walletList[current].password ){
					uni.showToast({title:this.lang[this.locale].edit.toast2,icon:'none'})
					return
				}
				if(!newPw.length){
					uni.showToast({title:this.lang[this.locale].edit.toast3,icon:'none'})
					return
				}
				if(newPw.length > 16){
					uni.showToast({title:this.lang[this.locale].edit.toast4,icon:'none'})
					return
				}
				if(newPw.length < 6){
					uni.showToast({title:this.lang[this.locale].edit.toast5,icon:'none'})
					return
				}
				if(!reg.test(newPw)){
					uni.showToast({title:this.lang[this.locale].edit.toast8,icon:'none'})
					return
				}
				if(newPw != reNewPw){
					uni.showToast({title:this.lang[this.locale].edit.toast6,icon:'none'})
					return
				}
				
				const newList = Object.assign({},walletList[current],{
					password:newPw
				})
				editWallet({
					'index':current,
					'list':newList
				})
				uni.setStorageSync('walletList',walletList)
				uni.showToast({title:this.lang[this.locale].edit.toast7})
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},500)
			}
		}
	}
</script>	
<style lang="less">
	page{
		background:#eee;
	}
	.addWallet{
		padding-top:20upx;
		.tit{
			color: #515a6e;
			padding:20upx;
			display:block;
		}
		.del{
			margin-top:100upx;
			margin-bottom:30upx;
		}
		.uni-card{
			input{
				width:98%;
			}
		}
	}
</style>
