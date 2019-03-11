<template>
	<view class="addWallet uni-padding-wrap">		
		<text class="tit">{{lang[locale].payment.tit2}}</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<textarea class="" type="text" v-model="key" :placeholder="lang[locale].payment.placeholder" style="font-size:28upx;height:120upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">{{lang[locale].payment.tit3}}</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner hr bet">
					<input type="number" v-model="amount" :placeholder="lang[locale].payment.placeholder2"/>
					<text @tap="all" style="color: #007AFF;">{{lang[locale].payment.btn}}</text>
				</view>
				<view class="uni-card-content-inner">
					<textarea class="" type="text" v-model="note" :placeholder="lang[locale].payment.placeholder3" style="font-size:28upx;height:80upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">{{lang[locale].payment.tit4}}</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<input type="password" v-model="password" :placeholder="lang[locale].payment.placeholder4"/>
				</view>
			</view>
		</view>
		<button type="primary" class="create" @tap="confirm">{{lang[locale].payment.btn2}}</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				key:'',
				note:'',
				amount:'',
				password:'',
				token:'',
				amountAll:'',
				issuer:''
			}
		},
		onNavigationBarButtonTap(e){
			this.scan()
		},
		onLoad(option) {
			this.token = option.token
			this.issuer = option.issuer
			this.amountAll = option.amount
			uni.setNavigationBarTitle({
				title: option.token + this.lang[this.locale].payment.tit
			})
		},
		computed:{
			...mapState(['currentWalletIndex','walletList','lang','locale'])
		},
		mounted(){
			uni.setNavigationBarTitle({
				title: this.lang[this.locale].payment.tit
			})
		},
		methods:{
			...mapMutations(['setCurWalletIndex','addWallet']),
			scan() {
				this.rightDrawerVisible = false
				uni.scanCode({
					success: (res) => {
						this.key = res.result
					}
				});
			},
			all(){
				this.amount = this.amountAll
			},
			// 授信,转账
            confirm() {
                this.loading = true
                const api = this.chainAPI
                //判断地址是否合法
                var isAddress = api.isValidAddress(this.key)
                if (isAddress.wallet === false) {
					uni.showToast({

						title:this.lang[this.locale].payment.toast,icon:'none'

					})
                    return false
                }
                //判断金额是否是大于0的数字                
				if (this.amount <= 0 ) {
					uni.showToast({
						title:this.lang[this.locale].payment.toast2,icon:'none'
					})
					return false
				}                
				if(this.amount*1 > this.amountAll*1 ){
					uni.showToast({
						title:this.lang[this.locale].payment.toast3,icon:'none'
					})
					return false
				}
				if(this.password == ''){
					uni.showToast({
						title:this.lang[this.locale].payment.toast4,icon:'none'
					})
					return
				}
				if(this.password != this.walletList[this.currentWalletIndex].password){
					uni.showToast({
						title:this.lang[this.locale].payment.toast5,icon:'none'
					})
					return
				}
                this.$http.post(this.$config.apiURL, JSON.stringify({
                    "method": "account_info",
                    "params": [
                        {
                            "account": this.walletList[this.currentWalletIndex].key,//账户
                        }
                    ]
                })).then(({data}) => {
                    const sequence = data.result.account_data.Sequence
					const account = this.token == this.$config.currency ? '' : this.issuer
					const currency = this.token
					var txJson = this.preparePayment(this.walletList[this.currentWalletIndex].key, this.key, this.amount, currency, account, this.note, sequence)
                    const signData = api.sign(txJson, this.walletList[this.currentWalletIndex].sn); // 交易签名
                    const sign = signData.signedTransaction					
                    this.submit(sign)
                }).catch((e) => {
                    console.log(e)
                })
            },
			submit(sign) {
                this.$http.post(this.$config.apiURL, JSON.stringify({
                    "method": "submit",
                    "params": [
                        {
                            "tx_blob": sign,
                        }
                    ]
                })).then(({data}) => {
                    if (data.result.engine_result == 'tesSUCCESS') {
						uni.showToast({
							title:this.lang[this.locale].payment.toast6
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
                    } else {
                        if (data.result.engine_result_code == 101 || data.result.engine_result_code == 104) {
							uni.showToast({
								title:this.lang[this.locale].payment.toast7,icon:'none'
							})
                        } else {
							uni.showToast({
								title:data.result.engine_result_message
							})
                        }
                    }
                }).catch((e) => {
                    console.log(e)
                })
            },
			prepareTrustline (address, amount, currency, issuer, sequence) {
                const txJson = {
                  'TransactionType': 'TrustSet',
                  'Flags': 131072,
                  'Account': address,
                  'LimitAmount': {
                    'value': amount,
                    'currency': currency,
                    'issuer': issuer
                  },
                  'Fee': this.$config.fee,
                  'Sequence': sequence
                }
                return txJson
            },
            preparePayment (address, to, amount, currency, issuer, memo, sequence) {
				console.log(address, to, amount, currency, issuer, memo, sequence)
                const api = this.chainAPI
                const util = api.base
                const txJson = {
                  'TransactionType': 'Payment',
                  'Account': address,
                  'Destination': to,
                  'Amount': util.prepareAmount({
                    value: amount,
                    currency: currency,
                    issuer: issuer
                  }),
                  'Fee': this.$config.fee, 
                  'Sequence': sequence, // 序列,通过accountinfo获取当前值后+1
                  'Memos': [
                    {
                      'Memo': {
                        'MemoType': util.string2Hex('swallet'), // Type
                        'MemoData': util.string2Hex(memo) // MemoMessage
                      }
                    }
                  ]
                }
				console.log(txJson)
                return txJson
            },
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
			padding-top:20upx;
			display:block;
		}
		.create{
			margin-top:100upx;
			margin-bottom:30upx;
		}
		.hr{
			position: relative;
			&.bet{
				display: flex;
				justify-content: space-between;
				input{width: 90%;}
			}
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
