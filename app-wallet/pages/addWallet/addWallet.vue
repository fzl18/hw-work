<template>
	<view class="addWallet uni-padding-wrap">
		<text class="tit">为您的钱包起个名</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<input class="" type="text" v-model="name" placeholder="请输入钱包名"/>
				</view>
			</view>
		</view>
		<text class="tit">请输入备份的钱包私钥</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<textarea ref="key" class="" type="text" v-model="key" placeholder="请输入私钥" style="font-size:30upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">设置交易密码</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner hr">
					<input type="password" v-model="password" placeholder="请输入交易密码"/>
				</view>
				
				<view class="uni-card-content-inner">
					<input type="password" v-model="repassword" placeholder="再次输入密码"/>
				</view>
			</view>
		</view>
		<button type="primary" class="create" @tap="create">立即创建</button>
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
				repassword:''
			}
		},
		onNavigationBarButtonTap(e){
			this.scan()
		},
		computed:{
			...mapState(['currentWalletIndex','walletList'])
		},
		methods:{
			...mapMutations(['setCurWalletIndex','addWallet']),
			scan() {
				this.rightDrawerVisible = false
				uni.scanCode({
					success: (res) => {
						this.key = res.result
					}
				});
			},
			handleInput(oj){
				this[oj] = event.target.value
			},
			create(){
				const { password, repassword, key, name} = this
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
				if(!password || !repassword){
					uni.showToast({title:'请设置交易密码'})
					return false
				}else if(password == repassword){					
					this.addWallet({
						key,password,name
					})
					try {
						uni.setStorageSync('walletList',this.walletList)
						uni.showToast({title:'创建成功'})
						setTimeout(()=>{
							uni.navigateBack({
								url:'/pages/list/list'
							})
						},1000)
					} catch (e) {
						uni.showToast({title:'创建失败'})
					}
				}else{
					uni.showToast({title:'密码设置不一致'})
					return
				}
			}
		}
	}
</script>	
<style lang="less">
	page{
		background:#eee
	}
	.addWallet{
		padding-top:20upx;
		.tit{
			color: #515a6e;
			padding:20upx;
			display:block;
		}
		.create{
			margin-top:100upx;
			margin-bottom:30upx;
			font-size:32upx;
			background: darkcyan;
		}
		.hr{
			position: relative;
			&::after{
				content: '';
				width: 100%;
				height: 1px;
				position: absolute;
				background: #ddd;
				bottom:0upx;
				left:0;
			}
		}
	}
</style>
