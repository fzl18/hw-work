<template>
	<view class="addWallet uni-padding-wrap">
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate uni-navigate-right">							
							<input type="text" value="" placeholder="请输入原密码"/>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate uni-navigate-right">							
							<input type="text" value="" placeholder="请输入新密码"/>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<input type="text" value="" placeholder="请输入确认密码"/>							
						</view>
					</view>
				</view>
			</view>
		</view>

		<button type="primary" class="del" @tap="save">保存</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				name:'',
				key:'',
				password:'',
				current:''
			}
		},
		onLoad(option) {
			console.log(option.index)
			this.current = option.index
		},
		computed:{
			...mapState(['walletList','currentWalletIndex'])
		},
		methods:{
			...mapMutations(['setCurWalletIndex','editWallet','setCurWalletIndex']),
			handleInput(oj){
				this[oj] = event.target.value
			},
			save(){
				const { password, key, name,current,currentWalletIndex,setCurWalletIndex,walletList} = this
				if(current == currentWalletIndex){
					setCurWalletIndex(0)
					uni.setStorageSync('currentWalletIndex', 0)
				}
				this.editWallet(current)
				uni.setStorageSync('walletList',walletList)
				uni.showToast({title:'修改成功'})
				setTimeout(()=>{
					uni.navigateTo({
						url:"/pages/list/list"
					})
				},500)
				if(!name.length){
					uni.showToast({title:'请输入钱包名'})
					return
				}
				if(!key.length){
					uni.showToast({title:'请输入私钥'})
					return
				}
				if(password.length < 6){
					uni.showToast({title:'密码至少6位'})
					return
				}
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
			font-size:32upx;
			background:darkcyan;
		}
	}
</style>
