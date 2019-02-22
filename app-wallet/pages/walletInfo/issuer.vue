<template>
	<view class="addWallet uni-padding-wrap">
		<text class="tit">发行方地址：</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<textarea class="" type="text" v-model="key" placeholder="请输入发行方地址 (可点击右上角扫码)." style="font-size:30upx;width:100%;height:120upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">资产名称</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd uni-list-cell-last" v-for="(item, index) in radioList" :key="index">
							{{item.text}}
							<radio :value="item.value" :checked="index === radioIndex" :disabled="item.value=='BVC' ? true : false"/>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<text class="tit">数量</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner" style="display: flex; justify-content: space-between;">
					<input type="number" v-model="amount" placeholder="请输入流通量" style="width: 90%;"/>
					<text @tap="all">全部</text>
				</view>
			</view>
		</view>
		<button type="primary" class="create" @tap="create">确定</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				name:'',
				key:'',
				amount:'',
				radioList: [{
					value: 'CADT',
					text: 'CADT'
				}],
				radioIndex: 0,
			}
		},
		onLoad(option) {

		},
		onNavigationBarButtonTap(e){
			this.scan()
		},
		computed:{
			...mapState(['currentWalletIndex','walletList'])
		},
		methods:{
			...mapMutations(['setCurWalletIndex','delWallet']),
			scan() {
				uni.scanCode({
					success: (res) => {
						this.key = res.result
					}
				});
			},
			create(){
				const { password, repassword, key, name} = this
				
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
							uni.navigateTo({
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
			},
			radioChange(evt) {
				const value = evt.target.value;
				for (let i = 0; i < this.radioList.length; i++) {
					if (this.radioList[i].value === value) {
						this.styleIndex = i;
						break;
					}
				}
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
			padding:20upx;
			display:block;
			font-size:30upx;
		}
		.create{
			margin-top:100upx;
			margin-bottom:30upx;
			font-size:32upx;
			background: darkcyan;
		}
		.radio{
			display: flex;
			justify-content: space-between;
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
