<template>
	<view class="addWallet " v-if="walletList[current]">
		<view class="uni-padding-wrap">
			<view class="uni-card">
				<view class="uni-card-content">
					<view class="uni-card-content-inner">
						<view class="uni-list-cell" @tap="show">
							<view class="uni-list-cell-navigate uni-navigate-right">
								{{lang[locale].info.name}}
								<view style="padding-right: 50upx;">
									{{walletList[current].name}}
								</view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-last" @tap="edit">
							<view class="uni-list-cell-navigate uni-navigate-right">
								{{lang[locale].info.resetPw}}							
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
						{{lang[locale].info.accountAddr}}：
						<view class="">
							{{walletList[current].key}}  
						</view>
						<text style="font-size:20upx;">（{{lang[locale].info.copy}}）</text>
					</view>
				</view>
			</view>
			
			<button type="primary" class="del" @tap="showPw">{{lang[locale].info.del}}</button>
		</view>		
		<modal 
			ref="unikModal"
			:modalTitle="modalTitle"
			@confirmModal="confirmModal"
			@cancelModal="cancelModal"
			:sureText="lang[locale].info.btn3"
			:cancelText="lang[locale].info.btn4"
			:clickMask="false"
			>
			<!-- 请输入新钱包名(16字符以内) -->
			<input type="text" v-model="newName" :focus="modalShow" :placeholder="lang[locale].info.placeholder" style="width: 100%;"/>

		</modal>
		<modal 
			ref="pwModal"
			:modalTitle="lang[locale].info.tit3"
			@confirmModal="confirmPwModal"
			@cancelModal="cancelModal"
			>
			<input type="text" v-model="vpw" :focus="modalPwShow" :placeholder="lang[locale].info.placeholder2"/>
		</modal>
	</view>
</template>

<script>
	import qrcode from '@/components/qrcode/qrcode.vue'
	import modal from '@/components/modal.vue'
	import {mapState,mapMutations} from 'vuex'
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
				modalTitle:'',
				newName:'',
				modalShow:false,
				vpw:'',
				modalPwShow:false,				
			}
		},
		onLoad(option) {
			// console.log(option.index)
			this.current = option.index
		},
		mounted() {
			this.modalTitle=this.lang[this.locale].info.tit2;
			setTimeout(()=>{				
				this.$refs.qr.creatQrcode()
			},50)
		},
		mounted(){
			uni.setNavigationBarTitle({
				title: this.lang[this.locale].info.tit
			})
		},
		computed:{
			...mapState(['walletList','currentWalletIndex','lang','locale'])
		},
		methods:{
			...mapMutations(['setCurWalletIndex','delWallet','editWallet','setRefresh']),
			scan() {
				this.rightDrawerVisible = false
				uni.scanCode({
					success: (res) => {
						this.key = res.result
					}
				});
			},
			del(){
				const { key, newname,current,currentWalletIndex,setCurWalletIndex,walletList,setRefresh} = this
				if(current == currentWalletIndex){
					setCurWalletIndex(0)
					uni.setStorageSync('currentWalletIndex', 0)
				}
				this.delWallet(current)
				uni.setStorageSync('walletList',walletList)
				uni.showToast({title:this.lang[this.locale].info.toast})
				setRefresh(true)
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
						uni.showToast({title:this.lang[this.locale].info.toast2})
					}
				})
			},
			edit(){
				uni.navigateTo({
					url:"/pages/walletInfo/edit?index=" + this.current
				})
			},
			show () {
				this.$refs.unikModal.show()
				this.modalShow = true
			},
			showPw(){
				this.$refs.pwModal.show()
				this.modalPwShow = true
			},
			confirmModal () {				
				if(this.newName && this.newName.length < 8){
					const newList = Object.assign({},this.walletList[this.current],{
						name:this.newName
					})
					this.editWallet({
						'index':this.current,
						'list':newList
					})
					uni.setStorageSync('walletList',this.walletList)
					uni.showToast({title:this.lang[this.locale].info.toast3})
				}else if(!this.newName){

					uni.showToast({title:this.lang[this.locale].info.toast4,icon:'none'})
					return
				}else{
					uni.showToast({title:this.lang[this.locale].info.toast5,icon:'none'})

					return
				}			
				this.modalShow = false
			},
			confirmPwModal(){
				if(this.vpw == this.walletList[this.currentWalletIndex].password){
					this.vpw = ''
					this.modalPwShow = false
					this.del()
					this.$refs.pwModal.closeModal()
				}else{

					uni.showToast({title:this.lang[this.locale].info.toast6,icon:'none'})

					this.vpw = ''					
				}
			},
			cancelModal() {
				console.log("取消");
				this.modalShow = false
				this.modalPwShow = false
			}
		}
	}
</script>	
<style lang="less">
	page{
		background:#eee
	}
	.addWallet{
		height: 100vh;
		box-sizing: border-box;
		padding-top:20upx;
		overflow: hidden;
		.tit{
			color: #515a6e;
			padding:20upx;
			display:block;
		}
		.del{
			margin-top:40upx;
			margin-bottom:30upx;
			background:#ea3b3b;
		}
		.box{
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 20upx;
		}
		.copy{
			background:#c5e9ff;
			margin-bottom:30upx;
			padding:10upx;
			word-break: break-all;
		}
	}
</style>
