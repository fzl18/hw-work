<template>
	<view class="token ">
		<view class="uni-padding-wrap part-top">
			<view class="uni-card" style="border-radius:40upx;background:#fbfbfb">
				<view class="uni-card-content">
					<view class="uni-card-content-inner top">
						<image :src="icon" style="width:70upx;height:70upx;"></image>
						<text style="font-size:36upx;color:orange;margin-top:20upx;">{{balance}}</text>
					</view>
				</view>
			</view>
			<view class="tit">
				{{lang[locale].token.tit2}}
			</view>
			<view class="uni-card middle">
				<view class="uni-card-content">
					<view class="uni-card-content-inner hr title">
						<text>{{lang[locale].token.tit3}}</text>
						<text>{{lang[locale].token.tit4}}</text>
						<text>{{lang[locale].token.tit5}}</text>
					</view>					
					<!-- <scroll-view scroll-y="true" class="scroll-Y" > -->
					<view class="scroll-Y" >
						<view class="uni-row tx" v-for="(item,index) in transactionList" :key="index">
							<text :style="item.status != 'tesSUCCESS' ? 'color:red' : 'color:#00B26A' ">{{item.type}}</text>
							<text>{{item.amount}}</text>
							<text>{{item.time}}</text>
						</view>
					<!-- </scroll-view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="collect" @tap="collect">{{lang[locale].token.btn}}</button>
			<button type="primary" class="payment" @tap="payment">{{lang[locale].token.btn2}}</button>
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
				icon:'',
				limit:10,
				transactionList:[],
				issuer:''
			}
		},
		onLoad(option) {
			this.token = option.token
			this.balance = option.balance
			this.icon = option.icon
			this.issuer = option.issuer
			uni.setNavigationBarTitle({
				title: option.token,				
			})
			this.transaction(50)
		},
		onShow() {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			this.transaction(50)
		},
		computed:{
			...mapState(['currentWalletIndex','walletList','lang','locale'])
		},
		mounted(){
			uni.setNavigationBarTitle({
				title: this.lang[this.locale].token.tit
			})
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
					url:`/pages/token/payment?token=${this.token}&amount=${this.balance}&issuer=${this.issuer}`
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
			                "account": this.walletList[this.currentWalletIndex].key,//账户
			                "limit": limit,
			            }
			        ],
			    })).then((res) => {
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
			            
			            var time = this.getTime((value.tx.date + 946684800) * 1000)
						if(this.token == amount.split(' ')[1]){
							this.transactionList.push({
// 								hash: value.tx.hash,
// 								address: value.tx.Account,
								type: value.tx.TransactionType,
								amount: amount,
// 								text: text,
// 								destination: destination,
// 								height: value.tx.ledger_index,
// 								rate: value.tx.Fee / 1000000,
								status: value.meta.TransactionResult,
								time: time
							})
						}			            
			        })
			        //是否有下一页
			        if (res.data.result.hasOwnProperty("marker")) {
			        } else {
			        }
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},500)
			    }).catch((e) => {
			        console.log(e)
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},500)
			    })
			},
			getTime(millisecond) {
                var time = new Date(millisecond);
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                m = m < 10 ? `0${m}` : m;
                var d = time.getDate();
                d = d < 10 ? `0${d}` : d;
                var h = time.getHours();
                h = h < 10 ? `0${h}` : h;
                var i = time.getMinutes();
                i = i < 10 ? `0${i}` : i;
                var s = time.getSeconds();
                s = s < 10 ? `0${s}` : s;
                return `${y}-${m}-${d} ${h}:${i}:${s}`
            }
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
					height:50vh;
					overflow: hidden;
					.uni-row{
						display: flex;
						justify-content: space-between;
						align-items: center;
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
