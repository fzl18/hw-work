<template>
	<view>
		<view class="vbox">
			<image class="top_back_img" :src="'../../static/bar' + (currentWalletIndex%5+1) + '.png'" ></image>
			<view class="top" v-if="walletList.length > 0">
				<view class="circle">
					<image class="head" src="../../static/wallet.png"></image>
				</view>
				<view class="top-texts">
					<text class="name">{{walletList[currentWalletIndex].name}}</text>
				</view>
				<view class="qrcode"  @tap="creatQrcode">
					<image src="../../static/qr.png" style="width:50upx;height:50upx;"></image>
				</view>
				<view class="address" v-if="walletList.length > 0">
					<view class="dizhi">
						{{lang[locale].list.walletAddr}}: {{walletBegin}}......{{walletEnd}}
					</view>
					<view class="qrcode" @tap="addrInfo()">
						<uni-icon size="26" type="more-filled" color="#FFFFFF"></uni-icon>
					</view>
				</view>
			</view>			
			<view class="noWallet" v-if="walletList.length == 0" @tap="addWallet">
				<text style="color:#FFFFFF;font-size:36upx;">{{lang[locale].list.txt}}</text>
				<text style="color:#FFFFFF;font-size:34upx;" >{{lang[locale].list.txt2}}</text>
			</view>			
		</view>
		<view class="uni-padding-wrap title" v-if="walletList.length > 0">
			<text>{{lang[locale].list.tit2}}</text>
			<view @tap="show" v-if="creditShow" style="display: flex;align-items: center;">				
				<uni-icon size="28" type="plusempty" color="#3697ff" ></uni-icon> <text style="font-weight:normal;">{{lang[locale].list.txt6}}</text>
			</view>
		</view>
		<view class="uni-padding-wrap">
			<view v-if="walletList.length == 0 " style="height:40vh;display:flex;align-items: center;color:#666;justify-content:center;">
				<text>{{lang[locale].list.txt3}}</text>
			</view>
			<view class="uni-card" v-if="walletList.length > 0 " v-for="(item,key) in list" :key="key" @tap="token(item.token, item.mount,item.icon,item.account)">
				<view class="uni-card-content" >
					<view class="uni-card-content-inner">
						<view class="uni-flex uni-row" >
							<view class="text" style="width: 100upx;display: flex; justify-content: left;align-items: center;">
								<image class="image" :src="item.icon" />
							</view>
							<view class="text tx-r" style="flex: 1;display: flex; justify-content: left;align-items: center;">
								<view class="t-big">{{item.token}}</view>
							</view>				
							<view class="text">
								<view class="t-big txt-r" style="display: flex; justify-content: flex-end;align-items: center;"> {{item.mount}}</view>
								<view class="t-small" v-if="item.limit">{{lang[locale].list.txt4}}：{{item.limit}} </view>
							</view>
						</view>
					</view>
				</view>
			</view>			
		</view>
		<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeRightDrawer">
			<view @touchmove.stop.prevent="moveHandle">				
				<view class="uni-common-mt sideTit">
					<view class="uni-title">{{lang[locale].list.myWallet}}</view>
					<view class="addWallet" @tap="addWallet" style="display: flex;align-items: center;">
						<uni-icon size="20" type="plus" color="#000"></uni-icon> <text style="margin-left:10upx;font-size:30upx;">{{lang[locale].list.add}}</text>
					</view>
				</view>
				<view class="walletList">
					<scroll-view scroll-y="true" class="scroll-Y" >
					<view class="uni-card diy" v-for="(item,key) in walletList" :key="key" @tap="see(item.token,key)" :style="'background:url(../../static/bar' + (key%5+1) + '.png) no-repeat;background-size:100% 100%;'">
						<view class="uni-card-content" >
							<view class="uni-card-content-inner">
								<view class="uni-flex uni-row" >
									<view class="icon"><image src="../../static/wallet.png"></image></view>
									<view class="token">{{item.name}}</view>				
									<view class="text" v-if="currentWalletIndex == key">
										<uni-icon size="24" type="checkbox-filled" color="#FFFFFF"></uni-icon>
									</view>
								</view>
								<view class="uni-flex uni-row" v-if="walletStr.length > 0">
									<view class="addr" v-if="walletStr[key]"> {{walletStr[key].start}}......{{walletStr[key].end}} </view>
									<view @tap.stop="addrInfo(key)"><uni-icon size="24" type="more-filled" color="#FFFFFF"></uni-icon></view>
								</view>
							</view>
						</view>
					</view>	
					</scroll-view>
					<view class="share" v-if="providerList.length">
						<view @tap="share(providerList[0])">
							{{lang[locale].list.txt5}}：<uni-icon size="26" type="weixin" color="green"></uni-icon> 
						</view>
					</view>
					<view class="lang">		
						<uni-segmented-control class="switch-lang" :current="current" :values="items" @clickItem="onClickItem" styleType="button" activeColor="#007aff"></uni-segmented-control>						
						<!-- <button type="default" class="switch-lang" @tap="">{{lang[locale].list.switch')}}</button> -->
					</view>
				</view>
				
			</view>
		</uni-drawer>

		<modal 
			ref="Modal"
			:modalTitle="lang[locale].list.tit3"
			@confirmModal="confirmModal"
			@cancelModal="cancelModal"
			:cancelButton="false"
			:sureText="lang[locale].list.closeBtn"
			:dark="true"
			>
			<view class="modal-input">
				<view class="input" v-if="walletList.length>0">
					<qrcode :val="walletList[currentWalletIndex].key" :size="qrsize" ref="qr"></qrcode>
					<view style="word-break: break-all;margin-top: 20upx;">
						{{lang[locale].list.reAccount}}
					</view>
					<view class="" @tap="copy">
						{{walletList[currentWalletIndex].key}}
					</view>
				</view>
			</view>
			
		</modal>
	</view>	
</template>
<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniDrawer from '@/components/uni-drawer.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import qrcode from '@/components/qrcode/qrcode.vue'
	import modal from '@/components/modal.vue'
	import uniSegmentedControl from '@/components/uni-segmented-control.vue'
	import {mapState,mapMutations} from 'vuex'
	import {
		friendlyDate
	} from '@/common/util.js';

	export default {
		components: {
			uniNavBar,
			uniDrawer,
			uniIcon,
			qrcode,
			modal,
			uniSegmentedControl
		},
		data() {
			return {
				account:'',
				rightDrawerVisible:false,
				result:'',
				isShowQR:false,
				qrsize:200,
				issuer:'',
				amount:0,
				walletStr:[],
				listIcon: ["https://files.bvcadt.com/charger/57764768-06c1-4cc9-b9e4-5a1b7aaa0731.jpg",
						"https://files.bvcadt.com/charger/3ab4e5e4-f985-479b-85d1-7c601b6a9f59.png"
					],
				list:[],
				creditShow:false,
				providerList:[],
				shareText:'',
				shareType:0,
				downloadUrl:'http://www.baidu.com',
				current:uni.getStorageSync('currentLangIndex') || 0,
				items: [
					'简体中文',
					// '繁體中文',
					'English',
				],
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.lang[this.locale].list.tit
			});
			uni.getProvider({
				service: 'share',
				success: (e) => {
					console.log('success', e);
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: this.lang[this.locale].list.name,
									id: 'weixin',
									sort:0
								})
								data.push({
									name: this.lang[this.locale].list.name2,
									id: 'weixin',
									type:'WXSenceTimeline',
									sort:1
								})
								break;
							case 'sinaweibo':
								data.push({
									name: this.lang[this.locale].list.name3,
									id: 'sinaweibo',
									sort:2
								})
								break;
							case 'qq':
								data.push({
									name: this.lang[this.locale].list.name4,
									id: 'qq',
									sort:3
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data.sort((x,y) => {
						return x.sort - y.sort
					});
				},
				fail: (e) => {
					console.log('获取登录通道失败', e);
					uni.showModal({
						content:this.lang[this.locale].list.modal,
						showCancel:false
					})
				}
			});
			// 清空
			// uni.removeStorageSync('walletList')
			// uni.removeStorageSync('currentWalletIndex')
			// console.log(uni.getStorageSync('walletList'))
			// console.log(this.chainAPI)			
			if(this.walletList.length > 0){
				this.account = this.walletList[this.currentWalletIndex].key
			}
			uni.startPullDownRefresh();
		},
		onShow(){
			this.initStr()
			if(this.refresh){
				uni.startPullDownRefresh()
				this.setRefresh(false)
			}
		},
		onNavigationBarButtonTap(e){
			this.rightDrawerVisible = !this.rightDrawerVisible
		},
		onPullDownRefresh() {
			this.getSDA()			
		},
		computed:{
			...mapState(['currentWalletIndex','walletList','refresh','lang','locale']),
			
			walletBegin(){
				if(this.walletList.length > 0){					
					return this.walletList[this.currentWalletIndex].key.substr(0,8)
				}
			},
			walletEnd(){
				if(this.walletList.length > 0){					
					return this.walletList[this.currentWalletIndex].key.substr(-8,8)
				}
			}
		},
		watch:{
			locale(loc){
				uni.setNavigationBarTitle({
					title: this.lang[loc].list.tit
				})
			}
		},
		methods: {
			...mapMutations(['setCurWalletIndex','setRefresh','setCurrentLangIndex','setLocale']),
			addWallet(){
				this.rightDrawerVisible = false
				uni.navigateTo({
					url: '/pages/addWallet/addWallet'
				})
			},
			showMenu() {
				this.rightDrawerVisible = !this.rightDrawerVisible
			},
			closeRightDrawer(){
				this.rightDrawerVisible = false
			},
			initStr(){
				this.walletStr = []
				this.walletList.length > 0 && this.walletList.map((item)=>{
					this.walletStr.push({
						start:item.key.substr(0,5),
						end:item.key.substr(-5,5)
					})
				})
			},

			see(token,index){
				this.setCurWalletIndex(index)
				uni.setStorageSync('currentWalletIndex', index)
				// this.getSDA()
				uni.startPullDownRefresh()
				this.rightDrawerVisible = false				
			},
			token(token,balance,icon,issuer){
				uni.navigateTo({
					url: `/pages/token/token?token=${token}&balance=${balance}&icon=${icon}&issuer=${issuer}`
				});
			},
			addrInfo(index){
				this.rightDrawerVisible = false
				uni.navigateTo({
					url: '/pages/walletInfo/info?index='+ (index != undefined ? index : this.currentWalletIndex)
				});
			},
			creatQrcode() {
				this.$refs.Modal.show()
				setTimeout(()=>{					
					this.$refs.qr.creatQrcode()
				},20)
			},
			show () {
				uni.navigateTo({
					url:"/pages/walletInfo/issuer"
				})
			},
			confirmModal () {
			},
			moveHandle(){
				
			},
			copy(){
				uni.setClipboardData({
					data:this.walletList[this.currentWalletIndex].key ,
					success: function () {
						uni.showToast({title:this.lang[this.locale].list.toast})
					}
				})
			},
			async share(e) {
				console.log('分享通道:'+ e.id +'； 分享类型:' + this.shareType);		
				let shareOPtions = {
					provider: e.id,
					scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
					type: this.shareType,
					success: (e) => {
						console.log('success', e);
						uni.showModal({
							content: this.lang[this.locale].list.modal2,
							showCancel:false
						})
					},
					fail: (e) => {
						console.log('fail', e)
						uni.showModal({
							content: this.lang[this.locale].list.modal3,
							showCancel:false
						})
					},
					complete:function(){
						console.log('分享操作结束!')
					}
				}
				
				switch (this.shareType){
					case 0:
						shareOPtions.summary = this.shareText;
						shareOPtions.imageUrl = this.listIcon[0];
						shareOPtions.title = this.shareText;
						shareOPtions.href = this.downloadUrl;
						break;
					case 1:
						shareOPtions.summary = this.shareText;
						break;
					case 2:
						shareOPtions.imageUrl = this.listIcon[0];
						break;
					default:
						break;
				}

				uni.share(shareOPtions);
			},
			
			//业务拿数据 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//SDA余额
			getSDA() {
				if(this.walletList.length == 0){
					uni.stopPullDownRefresh()
					return
				}				
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "account_info",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.walletList[this.currentWalletIndex].key, //账户
			            }
			        ]
			    })).then(({data}) => {
					this.list = []
			        if (data.result.status == 'success') {
						this.list.push({
							token:this.$config.currency,
							icon:this.listIcon[0],
							mount: data.result.account_data.Balance / 1000000,
							account:data.result.account_data.Account
						})
			            //发行商不显示二级资产
			            if (!(data.result.account_data.Flags & 0x00800000)) {
			                this.secondBalance()
			            } else {
			                // this.bvcTimeout = setTimeout(() => this.getSDA(), this.$config.timeout)
			            }
			        }
			        if (data.result.status == 'error') {
			            this.creditShow = false
			            this.list.push({
							token:this.$config.currency,
							icon:this.listIcon[0],
							mount: 0,
							account:''
						})
			            if (data.result.error != 'actNotFound') {
			                uni.showToast({
			                	title:`(${data.result.error}  ${data.result.error_message})`
			                })
			            } 
			        }
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},500)
			    }).catch((e) => {
			        console.log(e)
			        // this.bvcTimeout = setTimeout(() => this.getSDA(), this.$config.timeout)
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},500)
			    })			    
			},
			
			//二级资产余额
			secondBalance() {
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "account_lines",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.walletList[this.currentWalletIndex].key,//账户
			                "limit": this.$config.limit //需要配置
			            }
			        ]
			    })).then(({data}) => {
					this.creditShow = true
			        if (data.result.hasOwnProperty("lines")) {
			            data.result.lines.forEach((val, key) => {
			                if (val.balance >= 0) {
			                    this.list.push({
			                        mount: val.balance,
									icon:this.listIcon[key + 1],
			                        account: val.account,
			                        limit: val.limit,
									token:val.currency
			                    })
			                } 
			            })
			        }
			    }).catch((e) => {
			        console.log(e)
			    })
			    // this.bvcTimeout = setTimeout(() => this.getSDA(), this.$config.timeout)
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;					
				}
				this.setCurrentLangIndex(index);
				uni.setStorageSync('currentLangIndex',index);
				let selectLang='cn';
				if(index==0){
					selectLang='cn'
				}else if(index==1){
					selectLang='en'
				}
				this.setLocale(selectLang);
				uni.setStorageSync('locale', selectLang);
			},
		}
	}
</script>
<style lang="less">
	page {
		height: 100%;
		font-size: 11px;
		line-height: 1.8;
		background:#eee;
	}

	.uni-tab-bar {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.uni-tab-bar .list {
		width: 750upx;
		height: 100%;
	}

	.uni-swiper-tab {
		width: 100%;
		white-space: nowrap;
		line-height: 100upx;
		height: 100upx;
		border-bottom: 1px solid #c8c7cc;
	}

	.swiper-tab-list {
		font-size: 30upx;
		width: 150upx;
		display: inline-block;
		text-align: center;
		color: #555;
	}

	.uni-tab-bar .active {
		color: #007AFF;
	}

	.uni-tab-bar .swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
	}

	.uni-tab-bar-loading {
		padding: 20upx 0;
	}
	.index {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: white;
		border-top: 1px solid #cccccc;
	}
	
	.vbox {
		display: flex;
		flex-direction: column;
		align-items: center;
		height:320upx;
		background: #FFFFFF;
		position: relative;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		&::before{
			content: '';
			background: #eeeeee;
			height:1px;
			width:100%;
			position:absolute;
			top:0px;
			left: 0upx
		}
	}
	
	.top_back_img {
		position: absolute;
		top: 0upx;
		left:-8upx;
		width: 100%;
		height: 320upx;
		padding:5upx 10upx;
	}
	
	.top {
		display: flex;
		flex-wrap: wrap;
		width: calc(100% - 50upx);
		height: 200upx;
		justify-content:space-between;
		align-items: center;
		position: relative;
		top:60upx;
		z-index: 10;
	}
	.noWallet{
		
		display: flex;
		flex-direction: column;
		justify-content:space-between;		
		align-items: center;
		position: relative;
		top:110upx;
		z-index: 10;
	}
	.address{
		display: flex;
		justify-content:space-between;
		align-items: center;
		z-index: 20;
		width:100%;
		.dizhi{
			color: #FFFFFF;
			padding-left:50upx
		}
	}
	.qrcode{
		justify-content:flex-end;
		margin-right:45upx;
		color: #FFFFFF;
		display: block;
		align-items: center;
	}
	.circle {
		display: flex;
		margin-left: 50upx;
		overflow: hidden;		
	}
	
	.head {
		width: 60upx;
		height: 60upx;
	}
	
	.top-texts {
		display: flex;
		flex-direction: column;
		margin-left: 40upx;
		color: white;
		flex-grow: 1;
	}
	
	.name {
		font-size: 36upx;
		font-weight: 500;
	}
	
	.set-top-hr {
		width: 210upx;
		height: 6upx;
	}
	
	.top-changeInfo {
		margin-top: 250upx;
		width: 120upx;
		height: 28upx;
		line-height: 28upx;
		background-color: #FFFFFF;
		border-radius: 15upx;
		padding: 10upx;
		color: #33dce8;
	}
	
	.middle {
		display: flex;
		align-items: center;
		position: relative;
		top: -100upx;
		width: 80%;
		height: 100upx;
		background-color: white;
		border-radius: 15upx;
	}
	
	.middle-line {
		width: 2upx;
		height: 80upx;
		background-color: #eeeeee;
	}
	
	.middle-left {
		flex-grow: 1;
		color: #666666;
		display: flex;
		align-items: center;
		text-align: center;
	}
	
	.middle-right {
		flex-grow: 1;
		color: #666666;
		display: flex;
		align-items: center;
		text-align: center;
	}
	
	.middle-icon {
		width: 40upx;
		height: 40upx;
		margin-left: 20upx;
	}
	
	.middle-num {
		color: #fcac45;
		-webkit-font-smoothing: antialiased;
	}
	
	.cell {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #ccc;
		height: 90upx;
		align-items: center;
		justify-content: space-between;
	}
	
	.cell:active {
		background-color: #333;
		color: white;
		box-shadow: 1upx 1upx 35upx #ccc;
	}
	
	.cell-left {
		display: flex;
		align-items: center;
		margin-left: 65upx;
	}
	
	.cell-text {
		margin-left: 25upx;
	}
	
	.cell-right {
		margin-right: 45upx;
		height: 28upx;
	}
	
	.cell_icon {
		width: 40upx;
		height: 40upx;
		height: 40upx;
	}
	
	.right-arrow {
		color: #aaa;
		width: 15upx;
		height: 28upx;
	}
	.title{
		font-size:35upx;
		font-weight:bold;
		color:#333333;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top:20upx;
	}
	.t-big{
		font-size:32upx;
	}
	.t-small{
		font-size:22upx;
		color: #999;
	}
	.txt-r{
		text-align: right;
	}
	.image{
		width:60upx;
		height:60upx;
		border-radius:50%;
		/* border: 1px solid #ddd; */
		/* padding:10upx */
	}
	.sideTit{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background: #eee;
		align-items: center;
		font-weight: bold;
		padding:10upx 30upx;
		margin-top:0;
		.uni-title, .addWallet{
			font-size:34upx;
			font-weight:normal
		}		
	}
	.walletList{
		// padding: 30upx;
		.uni-card{
			border-radius:20upx;
			color: #FFFFFF;
			box-shadow:none;
			height: 230upx;
			margin:0;
		}
		.uni-card-content{
			padding:25upx;
			.uni-flex{
				justify-content: space-between;
				align-items: center;
				.token{
					flex-grow: 1;
					font-size:32upx
				}
				.icon{
					width:80upx;
					image{
						width:50upx;
						height:50upx
					}
				}
			}
		}
		.share{
			padding:20upx;
			display: flex;
			justify-content: flex-end;
		}
	}
	.seeQR{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items:center;
		padding: 30upx;
		text-align: center;
	}
	
	/* 遮罩层 */
	.uni-mask {
	    background: rgba(0, 0, 0, 0.6);
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    left: 0;
	    top: 0;
	    z-index: 30;
	}
	
	/* 弹出层形式的广告 */
	.uni-banner {
	    width: 500upx;
	    position: fixed;
	    left: 50%;
	    top: 50%;
	    background: #FFF;
	    border-radius: 10upx;
	    z-index: 99;
	    transform: translate(-50%, -50%);
	}
	.scroll-Y{
		height: 75vh;
	}
	.modal-input{
		display:flex;
		flex-direction:column;
		width:100%;
		.input{
			display: flex;
			width: 100%;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			
			input{
				width:80%;
				border: 1px solid darkcyan;
				padding:5upx 10upx;
				margin:10upx;
				border-radius:8upx;
			}
		}		
	}
	.lang{
		position: relative;
		bottom: -70upx;
	}
</style>
