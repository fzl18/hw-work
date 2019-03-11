<template>
	<view class="addWallet uni-padding-wrap">
		<text class="tit">{{lang[locale].issuer.tit2}}：</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<textarea class="" type="text" v-model="key" @blur="getSymbol" :placeholder="lang[locale].issuer.placeholder" style="font-size:30upx;width:100%;height:120upx;"/>
				</view>
			</view>
		</view>
		<text class="tit">{{lang[locale].issuer.tit3}}</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd uni-list-cell-last" v-for="(item, index) in symbolList" :key="index">
							{{item}}
							<radio :value="item" :checked="index === radioIndex" />
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<text class="tit">{{lang[locale].issuer.tit4}}</text>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner" style="display: flex; justify-content: space-between;">
					<input type="number" v-model="amount" :placeholder="lang[locale].issuer.placeholder2" style="width: 90%;"/>
					<text @tap="all">{{lang[locale].issuer.btn}}</text>
				</view>
			</view>
		</view>
		<button type="primary" class="create" @tap="confirm('trust_line')">{{lang[locale].issuer.btn2}}</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				name:'',
				key:this.$config.issueAddress,
				amount:'',
				radioList: [{
					value: 'CADT',
					text: 'CADT'
				}],
				radioIndex: 0,
				paymentList: [],
                paymentInfo: {
                    to: '',
                    amount: '',
                    text: ''
                },
				symbol: '',
                symbolList: [],
				list:[]
			}
		},
		onLoad(option) {
			this.getSymbol()
		},
		onNavigationBarButtonTap(e){
			this.scan()
		},
		computed:{
			...mapState(['currentWalletIndex','walletList','lang','locale'])
		},
		mounted(){
			uni.setNavigationBarTitle({
				title: this.lang[this.locale].issuer.tit
			})
		},
		methods:{
			...mapMutations(['setCurWalletIndex','delWallet']),
			scan() {
				uni.scanCode({
					success: (res) => {
						this.key = res.result
						this.getSymbol()
					}
				});
			},			
			radioChange(evt) {
				const value = evt.target.value;
				for (let i = 0; i < this.symbolList.length; i++) {
					if (this.symbolList[i] === value) {
						this.styleIndex = i;
						break;
					}
				}
				this.symbol = value
			},
			all(){
				this.amount = this.$config.issueAmount
			},
			//获取授信币种
			getSymbol() {
			    this.disabled = true
			    this.symbol = ''
			    this.$http.post(this.$config.apiURL, JSON.stringify({
			        "method": "gateway_balances",
			        "params": [
			            {
			                "ledger_index":"validated",
			                "account": this.key,//授信对方
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
			                "account": this.key,
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
			 // 授信
            confirm(val) {				
                const api = this.chainAPI
                //判断地址是否合法               
                var isAddress = api.isValidAddress(this.key)                
                if (isAddress.wallet === false) {
					uni.showToast({

						title:this.lang[this.locale].issuer.toast,icon:'none'

					})
                    this.loading = false
                    return false
                }
                //判断金额是否是大于0的数字                
				if (this.amount == '') {
					uni.showToast({

						title:this.lang[this.locale].issuer.toast2,icon:'none'

					})
					return false
				}
				if (this.symbol == '') {
					uni.showToast({

						title:this.lang[this.locale].issuer.toast3,icon:'none'

					})
					return false
				}
				 if (this.symbol.length < 2) {
					uni.showToast({

						title:this.lang[this.locale].issuer.toast4,icon:'none'

					})
					return false
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
					const issuer = this.key
					var txJson = this.prepareTrustline(this.walletList[this.currentWalletIndex].key, this.amount, this.symbol, issuer, sequence)                    
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
							title:this.lang[this.locale].issuer.toast5
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
                        
                    } else {
                        if (data.result.engine_result_code == 101 || data.result.engine_result_code == 104) {                            
							uni.showToast({

								title:this.lang[this.locale].issuer.toast6,icon:'none'

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
			padding:20upx;
			display:block;
			font-size:30upx;
		}
		.create{
			margin-top:100upx;
			margin-bottom:30upx;
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
