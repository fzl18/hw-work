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
						地址: {{walletBegin}}......{{walletEnd}}
					</view>
					<view class="qrcode" @tap="addrInfo()">
						<uni-icon size="24" type="more-filled" color="#FFFFFF"></uni-icon>
					</view>
				</view>
			</view>			
			<view class="noWallet" v-if="walletList.length == 0" @tap="addWallet">
				<text style="color:#FFFFFF;font-size:36upx;">暂无钱包信息</text>
				<text style="color:#FFFFFF;font-size:34upx;" >点击这里添加</text>
			</view>			
		</view>
		<view class="uni-padding-wrap title" v-if="walletList.length > 0">
			<text>资产</text>
			<view @tap="show">				
				<uni-icon size="22" type="plus-filled" color="orange"></uni-icon> 添加资产
			</view>
		</view>
		<view class="uni-padding-wrap">
			<view v-if="walletList.length == 0 " style="height:40vh;display:flex;align-items: center;color:#666;justify-content:center;">
				<text>暂无资产</text>
			</view>
			<view class="uni-card" v-if="walletList.length > 0 " v-for="(item,key) in list" :key="key" @tap="token(item.token, item.mount,item.icon)">
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
								<view class="t-small"> ≈ ￥ {{item.cny}} </view>
							</view>
						</view>
					</view>
				</view>
			</view>			
		</view>
		<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeRightDrawer">
			<view>				
				<view class="uni-common-mt sideTit">
					<view class="uni-title">我的钱包账户</view>
					<view class="addWallet" @tap="addWallet">
						<uni-icon size="20" type="plus-filled" color="orange"></uni-icon> <text style="margin-left:10upx;font-size:30upx;">添加</text>
					</view>
				</view>
				<view class="walletList">
					<scroll-view scroll-y="true" class="scroll-Y" >
					<view class="uni-card" v-for="(item,key) in walletList" :key="key" @tap="see(item.token,key)" :style="'background:url(../../static/bar' + (key%5+1) + '.png) no-repeat;background-size:cover'">
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
				</view>
			</view>
		</uni-drawer>

		<modal 
			ref="Modal"
			:modalTitle="modalTitle"
			@confirmModal="confirmModal"
			@cancelModal="cancelModal"
			:cancelButton="false"
			sureText="关闭"
			:dark="true"
			>
			<view class="modal-input">
				<view class="input" v-if="walletList.length>0">
					<qrcode :val="walletList[currentWalletIndex].key" :size="qrsize" ref="qr"></qrcode>
					<view style="word-break: break-all;margin-top: 20upx;">
						收款账户：{{walletList[currentWalletIndex].key}}
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
			modal
		},
		data() {
			return {
				rightDrawerVisible:false,
				result:'',
				isShowQR:false,
				qrsize:200,
				issuer:'',
				amount:0,
				modalTitle:'查看地址',
				walletStr:[],
				limit:10,
				list: [{
						icon:"https://files.bvcadt.com/charger/57764768-06c1-4cc9-b9e4-5a1b7aaa0731.jpg",
						token: "BVC",
						cny: 310.21,
						mount:12000
					},
					{
						icon:"https://files.bvcadt.com/charger/3ab4e5e4-f985-479b-85d1-7c601b6a9f59.png",
						token: "CADT",
						cny: 310.21,
						mount:12000
					}
				]
			}
		},
		onLoad() {
			// 清空
			// uni.removeStorageSync('walletList')
			// uni.removeStorageSync('currentWalletIndex')
			// console.log(uni.getStorageSync('walletList'))
			console.log(this.chainAPI)
			this.getSDA()
            this.transaction(this.limit)
		},
		onShow(){
			this.initStr()
		},
		onNavigationBarButtonTap(e){
			this.rightDrawerVisible = !this.rightDrawerVisible
		},
		
		computed:{
			...mapState(['currentWalletIndex','walletList']),
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
		
		methods: {
			...mapMutations(['setCurWalletIndex']),
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
				this.rightDrawerVisible = false
			},
			token(token,balance,icon){
				uni.navigateTo({
					url: `/pages/token/token?token=${token}&balance=${balance}&icon=${icon}`
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
				this.$refs.qr.creatQrcode()
			},
			show () {
				uni.navigateTo({
					url:"/pages/walletInfo/issuer"
				})
				// this.$refs.Modal.show()
			},
			confirmModal () {
			},
			
			
			//业务拿数据 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//SDA余额
			getSDA() {
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "account_info",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.$parent.account,//账户
			            }
			        ]
			    })).then(({data}) => {
			        if (data.result.status == 'success') {
			            this.SDA = `${data.result.account_data.Balance / 1000000} ${this.$config.currency}`
			            //发行商不显示二级资产
			            if (!(data.result.account_data.Flags & 0x00800000)) {
			                this.secondBalance()
			                this.balanceShow = true
			            } else {
			                // this.bvcTimeout = setTimeout(() => this.getSDA(), this.$config.timeout)
			            }
			        }
			        if (data.result.status == 'error') {
			            this.$parent.logintype = 1
			            this.SDA = 0
			            if (data.result.error != 'actNotFound') {
			                this.$Message.error(`(${data.result.error}  ${data.result.error_message})`)
			            } 
			        }
			    }).catch((e) => {
			        console.log(e)
			        // this.bvcTimeout = setTimeout(() => this.getSDA(), this.$config.timeout)
			    })
			    
			},
			
			//二级资产余额
			secondBalance() {
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "account_lines",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.$parent.account,//账户
			                "limit": this.$config.limit //需要配置
			            }
			        ]
			    })).then(({data}) => {
			        this.balanceList = [];
			        this.paymentList = []
			        if (data.result.hasOwnProperty("lines")) {
			            data.result.lines.forEach((val, key) => {
			                if (val.balance >= 0) {
			                    this.balanceList.push({
			                        "balance": `${val.balance} ${val.currency}`,
			                        "account": val.account,
			                        "limit": val.limit
			                    })
			    
			                    if (val.balance > 0) {
			                        this.paymentList.push({
			                            "symbol": `${val.currency} (${val.account})`,
			                        })
			                    }
			                } 
			            })
			        }
			    }).catch((e) => {
			        console.log(e)
			    })
			    this.bvcTimeout = setTimeout(() => this.getSDA(), this.$config.timeout)
			},
			
			//获取授信币种
			getSymbol() {
			    this.disabled = true
			    this.num = this.$config.issueAmount
			    this.symbol = ''
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "gateway_balances",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.address,//授信对方
			            }
			        ]
			    })).then(({data}) => {
			        if (data.result.hasOwnProperty("obligations")) {
			            let keys = Object.keys(data.result.obligations)
			            if (keys.length = 1) {
			                this.symbol = keys[0]
			            }
			            this.symbolList = keys
			            this.list = data.result.obligations
			        } else {
			            this.symbolList = []
			        }
			    }).catch((e) => {
			        console.log(e)
			        return false
			    })
			
			    //判断
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "account_info",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.address,
			            }
			        ]
			    })).then(({data}) => {
			        if (data.result.status == 'success') {
			            if (data.result.account_data.Flags & 0x00800000) {
			                this.disabled = false
			            }
			        }
			    }).catch((e) => {
			        console.log(e)
			    })
			},
			
			//交易记录
			transaction(limit) {
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "account_tx",
			        "params": [
			            {   		
			                "forward":false,
			                "ledger_index_min":-1,
			                "account": this.$parent.account,//账户
			                "limit": limit,
			            }
			        ],
			    })).then((res) => {
			       //清空数据,不清空加载下一页数据会重复
			        this.transactionList = []
			        const api = this.chainAPI;
			        const util = api.base;
			        res.data.result.transactions.forEach((value, key) => {
			            var amount = ''
			            var destination = '--'
			            if (value.tx.TransactionType == 'MultiPayment') {
			                amount = '--'
			            }
			            if (value.tx.TransactionType == 'Payment') {
			                if (typeof(value.tx.Amount) == 'string') {
			                    amount = `${value.tx.Amount / 1000000} ${this.$config.currency}`
			                }
			                if (typeof(value.tx.Amount) == 'object') {
			                    amount = `${value.tx.Amount.value} ${value.tx.Amount.currency}`
			                }
			                destination = value.tx.Destination
			            }
			            if (value.tx.TransactionType == 'TrustSet') {
			                amount = `${value.tx.LimitAmount.value} ${value.tx.LimitAmount.currency}`
			            }
			            if (value.tx.TransactionType == 'OfferCreate') {
			                if (typeof(value.tx.TakerGets) == 'string') {
			                    var get = `${value.tx.TakerGets / 1000000} ${this.$config.currency}`
			                }
			                if (typeof(value.tx.TakerGets) == 'object') {
			                    var get = `${value.tx.TakerGets.value} ${value.tx.TakerGets.currency}`
			                }
			                if (typeof(value.tx.TakerPays) == 'string') {
			                    var pay = `${value.tx.TakerPays / 1000000} ${this.$config.currency}`
			                }
			                if (typeof(value.tx.TakerPays) == 'object') {
			                    var pay = `${value.tx.TakerPays.value} ${value.tx.TakerPays.currency}`
			                }
			                amount = `${get} -> ${pay}`
			            }
			
			            //备注
			            var text = '--'
			            if (value.tx.hasOwnProperty("Memos")) {
			                text = value.tx.Memos[0].Memo.hasOwnProperty("MemoData") ? util.hex2String(value.tx.Memos[0].Memo.MemoData) : '--'
			            }
			            
			            var time = this.getTime((value.tx.date + 946684800) * 1000);
			
			            this.transactionList.push({
			                hash: value.tx.hash,
			                address: value.tx.Account,
			                type: value.tx.TransactionType,
			                amount: amount,
			                text: text,
			                destination: destination,
			                height: value.tx.ledger_index,
			                rate: value.tx.Fee / 1000000,
			                status: value.meta.TransactionResult,
			                time: time
			            })
			        })
			        this.pageLoading = false
			        this.refresh = false
			
			        //是否有下一页
			        if (res.data.result.hasOwnProperty("marker")) {
			            this.more = true
			        } else {
			            this.more = false
			        }
			
			    }).catch((e) => {
			        console.log(e)
			    })
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
		width: 90%;
		height: 260upx;
		padding:30upx;
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
		display: flex;
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
		align-items: center;
		font-weight: bold;
		color: #FFFFFF;
		background:#333;
		margin-top:20upx;
		padding:10upx 30upx;
		.uni-title, .addWallet{
			font-size:34upx;
			font-weight:normal
		}		
	}
	.walletList{
		padding: 30upx;
		.uni-card{
			border-radius:20upx;
			color: #FFFFFF
		}
		.uni-card-content{
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
</style>
