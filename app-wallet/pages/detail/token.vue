<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="nickname" placeholder="请填写钱包名" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="pw" placeholder="请填写密码" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="pw2" placeholder="请再次填写密码" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-list">
						<view class="input">
							<input class="uni-input" name="info" placeholder="请填写密码提示信息（可不填）" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-title">性别</view>
					<radio-group class="uni-flex" name="gender">
						<label>
							<radio value="男" />男</label>
						<label>
							<radio value="女" />女</label>
					</radio-group>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" style="background: #00B26A;color:#FFFFFF">创建</button>
					<button type="default" formType="reset" style="background:#422185;color:#FFFFFF">导入钱包</button>
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
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"nickname", checkType : "string", checkRule:"1,6",  errorMsg:"钱包名应为1-6个字符"},
					{name:"pw", checkType : "string", checkRule:"1,6",  errorMsg:"密码不能为空"},
					{name:"pw2", checkType : "notsame", checkRule:"pw",  errorMsg:"密码不一致"},
					{name:"gender", checkType : "in", checkRule:"男,女",  errorMsg:"请选择性别"}
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
			formReset: function (e) {
				console.log("清空数据")
				this.chosen = ''
			}
		}
	}
</script>

<style>
	.input{
		margin: 50upx 0 10upx 0;
	}
</style>
