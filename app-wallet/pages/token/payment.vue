<template>
	<view class="addWallet uni-padding-wrap">		
		<text class="tit">收款方</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<textarea class="" type="text" v-model="key" placeholder="请输入收款方地址 (可点击右上角扫码)" style="font-size:28upx;height:80upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">数量 / 备注</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner hr bet">
					<input type="number" v-model="amount" placeholder="填写转出数量"/>
					<text @tap="all" style="color: #007AFF;">全部</text>
				</view>
				<view class="uni-card-content-inner">
					<textarea class="" type="text" v-model="note" placeholder="填写备注" style="font-size:28upx;height:80upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">输入交易密码</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<input type="password" v-model="password" placeholder="请输入交易密码"/>
				</view>
			</view>
		</view>
		<button type="primary" class="create" @tap="create">确认转出</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				key:'',
				note:'',
				amount:'',
				password:'',
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
			all(){
				
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
			padding-top:20upx;
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
			&.bet{
				display: flex;
				justify-content: space-between;
				input{width: 90%;}
			}
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
