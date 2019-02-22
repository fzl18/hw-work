<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="nickname" placeholder="收款人钱包地址" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="pw" placeholder="转账金额" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="pw2" placeholder="备注" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-list" style="margin:30upx 0;">
						<view class="uni-title">矿工费用</view>
						<view>
							<slider value="50" @change="sliderChange" show-value />
						</view>
					</view>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" style="background: #422185;color:#FFFFFF">下一步</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	var  graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				title: '表单验证',
			}
		},
		methods: {
			formSubmit(e) {
				//定义表单规则
				var rule = [
					{name:"nickname", checkType : "notnull", checkRule:"1",  errorMsg:"收款人钱包地址不能为空"},
					{name:"pw", checkType : "notnull", checkRule:"1,6",  errorMsg:"转账金额不能为空"}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			formReset(e) {
				console.log("清空数据")
				this.chosen = ''
			},
			sliderChange(e) {
				uni.showToast({title:e.detail.value, icon:"none"})
			}
		}
	}
</script>

<style>
	.input{
		margin: 50upx 0 10upx 0;
	}
	.uni-list::before{
		height:0;
	}
</style>
