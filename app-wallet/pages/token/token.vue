<template>
	<view class="token ">
		<view class="uni-padding-wrap part-top">
			<view class="uni-card" style="border-radius:40upx;">
				<view class="uni-card-content">
					<view class="uni-card-content-inner top">
						<image :src="icon" style="width:70upx;height:70upx;"></image>
						<text style="font-size:36upx;color:orange;margin-top:20upx;">{{balance}}</text>
					</view>
				</view>
			</view>
			<view class="tit">
				交易记录
			</view>
			<view class="uni-card middle">
				<view class="uni-card-content">
					<view class="uni-card-content-inner hr title">
						<text>类型</text>
						<text>金额</text>
						<text>时间</text>
					</view>					
					<scroll-view scroll-y="true" class="scroll-Y" >
						<view class="uni-row">
							<text>类型</text>
							<text>金额</text>
							<text>2019-01-22</text>
						</view>
						<view class="uni-row">
							<text>类型</text>
							<text>金额</text>
							<text>2019-01-22</text>
						</view>
						<view class="uni-row">
							<text>类型</text>
							<text>金额</text>
							<text>2019-01-22</text>
						</view>
						<view class="uni-row">
							<text>类型</text>
							<text>金额</text>
							<text>2019-01-22</text>
						</view>
						<view class="uni-row">
							<text>类型</text>
							<text>金额</text>
							<text>2019-01-22</text>
						</view>
						<view class="uni-row">
							<text>类型</text>
							<text>金额</text>
							<text>2019-01-22</text>
						</view>
					</scroll-view>					
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="collect" @tap="collect">收款</button>
			<button type="primary" class="payment" @tap="payment">转账</button>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				token:'',
				balance: 0,
				icon:''
			}
		},
		onLoad(option) {
			this.token = option.token
			this.balance = option.balance
			this.icon = option.icon
			uni.setNavigationBarTitle({
				title: option.token,				
			})
		},
		computed:{
			...mapState(['currentWalletIndex','walletList'])
		},
		methods:{
			...mapMutations(['setCurWalletIndex','delWallet']),
			scan() {
				this.rightDrawerVisible = false
				uni.scanCode({
					success: (res) => {
						this.key = res.result
					}
				});
			},
			collect(){
				uni.navigateTo({
					url:"/pages/token/collect"
				})
			},
			payment(){
				uni.navigateTo({
					url:"/pages/token/payment"
				})
			},
			
		}
	}
</script>	
<style lang="less">
	page{
		background:#eee
	}
	.token{
		padding-top:20upx;
		height:100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		.part-top{
			display: flex;
			flex-direction:column;
			flex: 1;
			.top{
				display:flex;
				flex-direction:column;
				justify-content:space-between;
				align-items: center;
			}
			.middle{
				margin-bottom:40upx;
				flex:1;
				.title{
					display: flex;
					justify-content:space-between;
					font-weight: bold;
					color: #515a6e;
					text{
						
						&:nth-child(1){
							width:30%
						}
						&:nth-child(2){
							flex:1;
						}
						&:nth-child(3){
							
						}
					}
				}
				.scroll-Y{
					width: 92vw;
					height:48vh;
					.uni-row{
						display: flex;
						justify-content: space-between;
						color: #666;
						&:nth-child(2n){
							background:#eee;
						}
						text{
							padding:5upx 10upx;
							&:nth-child(1){
								padding-left:30upx;
								width: 25%;
							}
							&:nth-child(2){
								flex:1
							}
							&:nth-child(3){
								width: 30%;
								text-align:right;
								padding-right:20upx;
							}
						}
					}
				}
			}
		}
		
		
		.btn{
			justify-items: end;
			display: flex;
			.collect, .payment{
				flex: 1;
				border-radius:0;
				background: darkcyan;
				border:none;
				&::after{
					border:none;
				}
			}
			.collect{
				background: #fbfbfb;
				color: #000;
			}
		}
		.tit{
			color: #515a6e;
			padding-top:10upx;
			display:block;
			font-size:30upx;
			font-weight:bold;
		}
		.create{
			margin-top:100upx;
			margin-bottom:30upx;
			font-size:32upx;
			background: #17233d;
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
