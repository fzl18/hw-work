<template>
	<view>
		<view class="uni-padding-wrap">
			<view class="img" style="text-align: center;">
				<image src="../../static/clogo.png" mode=" center" style="width: 300upx; height:300upx;"></image>
			</view>
			<view class="uni-card">
				<view class="uni-card-content" style="font-size:30upx;padding:20upx;">
					{{name}}
				</view>
			</view>			
		</view>
	</view>
</template>

<script>
	export default {		
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: option.name
			})
			this.name = option.name			
		},
		data(){
			return{
				name:''
			}
		}
	}
</script>

<style>
	.img{
		margin-top:200upx;
		margin-bottom:100upx;
		
	}
</style>
