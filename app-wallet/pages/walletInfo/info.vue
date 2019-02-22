<template>
	<view class="addWallet " v-if="walletList[current]">
		<view class="uni-padding-wrap">
			<view class="uni-card">
				<view class="uni-card-content">
					<view class="uni-card-content-inner">
						<view class="uni-list-cell" @tap="show">
							<view class="uni-list-cell-navigate uni-navigate-right">
								钱包名称
								<view style="padding-right: 50upx;">
									{{walletList[current].name}}
								</view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-last" @tap="edit">
							<view class="uni-list-cell-navigate uni-navigate-right">
								修改交易密码							
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-card">
				<view class="uni-card-content box" >
					<view class="uni-card-content-inner">
						<qrcode :val="walletList[current].key" :size="250" ref="qr"></qrcode>
					</view>
					<view class="copy" @tap="setClipboard">
						账户地址：
						<view class="">
							{{walletList[current].key}}  <text style="font-size:20upx;">（点击复制）</text>
						</view> 
					</view>
				</view>
			</view>
			
			<button type="primary" class="del" @tap="del">删除钱包</button>
		</view>		
		<modal 
			ref="unikModal"
			:modalTitle="modalTitle"
			@confirmModal="confirmModal"
			@cancelModal="cancelModal"
			>
			<input type="text" v-model="newName" :focus="modalShow" placeholder="请输入新钱包名"/>
		</modal>
	</view>
</template>

<script>
	import qrcode from '@/components/qrcode/qrcode.vue'
	import modal from '@/components/modal.vue'
	import {mapState,mapMutations} from 'vuex'
	// const dcRichAlert = uni.requireNativePlugin('DCloud-RichAlert')
	export default{
		components: {
			qrcode, modal
		},
		data(){
			return{
				name:'',
				key:'',
				password:'',
				current:'',
				modalTitle:'修改钱包名',
				newName:'',
				modalShow:false
			}
		},
		onLoad(option) {
			console.log(option.index)
			this.current = option.index
		},
		mounted() {
			this.$refs.qr.creatQrcode()
// 			dcRichAlert.show({
// 				 position: 'bottom',
// 				 title: "提示信息",
// 				 titleColor: '#FF0000',
// 				 content: "<a href='https://uniapp.dcloud.io/' value='Hello uni-app'>uni-app</a> 是一个使用 Vue.js 开发跨平台应用的前端框架!\n免费的\n免费的\n免费的\n重要的事情说三遍",
// 				 contentAlign: 'left',
// 				 checkBox: {
// 					 title: '不再提示',
// 					 isSelected: true
// 				 },
// 				 buttons: [{
// 					 title: '取消'
// 				 }, {
// 					 title: '否'
// 				 }, {
// 					 title: '确认',
// 					 titleColor: '#3F51B5'
// 				 }]
// 			}, result => {
// 				 console.log(result)
// 			});
		},
		computed:{
			...mapState(['walletList','currentWalletIndex'])
		},
		methods:{
			...mapMutations(['setCurWalletIndex','delWallet','setCurWalletIndex']),
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
			del(){
				const { password, key, name,current,currentWalletIndex,setCurWalletIndex,walletList} = this
				if(current == currentWalletIndex){
					setCurWalletIndex(0)
					uni.setStorageSync('currentWalletIndex', 0)
				}
				this.delWallet(current)
				uni.setStorageSync('walletList',walletList)
				uni.showToast({title:'删除成功'})
				setTimeout(()=>{
					uni.navigateBack({
						delta:3
					})
				},500)
			},
			setClipboard(){
				uni.setClipboardData({
					data:this.walletList[this.current].key ,
					success: function () {
						uni.showToast({title:'复制成功'})
					}
				})
			},
			edit(){
				uni.navigateTo({
					url:"/pages/walletInfo/edit"
				})
			},
			show () {
				this.$refs.unikModal.show()
				this.modalShow = true
			},
			confirmModal () {
				console.log("确定");
				this.modalShow = false
			},
			cancelModal() {
				console.log("取消");
				this.modalShow = false
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
		.del{
			margin-top:100upx;
			margin-bottom:30upx;
			font-size:32upx;
			background:darkcyan;
		}
		.box{
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 20upx;
		}
		.copy{
			background: lightblue;
			margin-bottom:30upx;
			padding:10upx;
			word-break: break-all;
		}
	}
</style>
