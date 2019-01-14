
<template>
    <div class="layout">
            <Layout>
                <Header>
                    <Menu mode="horizontal" theme="dark" active-name="1">
                        <div class="layout-logo"><img src="../assets/logo.png" alt=""><span>{{Lang[useLang].title}}</span> <span class="sub">{{Lang[useLang].welcome}}</span> </div>
                        <div class="layout-nav">
                            <Button icon="md-log-out" size="large" type='primary' class="b2" @click="logout">退出登录</Button>
                        </div>
                    </Menu>
                </Header>
                <Content :style="{padding: '0 50px'}">
                    <Card :style="{margin: '20px 0'}" v-if="$parent.logintype == 1">
                        <div><Button icon="md-add" size="large" type='primary' @click="showModal">添加授信</Button></div>
                    </Card>
                    
                        <div style="min-height:calc(100vh - 230px);">
                            <Row>
                                <Col span="24" style="margin-bottom:20px">
                                    <Card>
                                        <p slot="title">
                                            地址：{{$parent.account}}                                            
                                        </p>
                                        <Row style="line-height:30px">
                                            <Col><table><tr><td valign="top">余额：</td><td>
                                                <p>{{ this.SDA }}</p>
                                                <p v-for="(item, index) in balanceList" :key="index">{{ item.balance }} ({{ item.account }})</p>
                                            </td></tr></table></Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span="24" style="margin-bottom:20px" v-if="$parent.logintype == 2">
                                    <Card>
                                        <p slot="title">转账</p>
                                        <Row style="line-height:40px">
                                            <Col> 
                                                <Input v-model="paymentInfo.to" style="width:400px" size="large">
                                                <span slot="prepend">接收地址</span>
                                                </Input>
                                            </Col>
                                            <Col style="margin:20px 0">                                                
                                                <Input v-model="paymentInfo.amount" style="width:400px;" size="large" >
                                                <span slot="prepend">转账金额</span>
                                                    <Select v-model="currency" slot="append" style="width:100px;" placeholder="选择币种">
                                                        <Option value="SDA">SDA</Option>
                                                        <Option  v-for="(item, index) in paymentList" :value="item.symbol" :key=index>{{ item.symbol }}</Option>
                                                    </Select>
                                                </Input>
                                            </Col>
                                            <Col span="24">                                                
                                                <Input style="width:400px" v-model="paymentInfo.text" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入转账备注..." >
                                                </Input>
                                            </Col>
                                            <Button type="info" :loading="loading" @click="confirm('payment')"> 转账 </Button>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span="24" >
                                    <Card dis-hover class="tx">
                                        <p slot="title">交易记录</p>
                                        <Table stripe :columns="columns" :data="transactionList" height="550" style="border:none"></Table>
                                        <div style="text-align:center;margin-top:15px"><Button type="info" ghost @click="loadmore" :loading="loading" v-show="more"> 加载更多 </Button><Button type="success" ghost @click="reload"> 刷新 </Button></div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                </Content>
                <Footer class="layout-footer-center">2019 &copy; Blockchain Venture Capital | All Rights Reserved </Footer>
            </Layout>
            <Modal
                v-model="modal"
                title=""
                @on-ok="confirm('trust_line')"
                ok-text="确定授信"
                class-name="vertical-center-modal">
                <Row style="padding:30px 0 10px 30px;line-height:50px;font-size:15px">
                    <Col span="24">发行地址: <Input size="large" v-model="address" placeholder="请输入..." style="width:350px" @on-blur="getSymbol" /></Col>
                    <Col span="24">
                    授信币种: 
                    <Input  size="large" v-model="num" placeholder="请输入数量" style="width:100px"></Input>
                    <AutoComplete
                        @keyup.native="upper"
                        v-model="symbol"
                        :data="symbolList"
                        size="large"
                        placeholder="币种"
                        style="width:120px">
                    </AutoComplete>
                    </Col>
                </Row>                
            </Modal>
            <Modal
                v-model="detail"
                title="交易记录详情"
                :footer-hide="true"
                class-name="vertical-center-modal">
                <table width="100%" class="list">
                    <tr>
                        <td align="left" bgcolor="#17233d" colspan="2" style="color:#fff;">交易哈希: {{ this.data.hash }}</td>
                    </tr>
                    <tr>
                        <td align="left">交易类型</td>
                        <td align="right">{{ this.data.type }}</td>
                    </tr>
                    <tr>
                        <td align="left">交易状态</td>
                        <td align="right">{{ this.data.status }}</td>
                    </tr>
                    <tr>
                        <td align="left">交易数量</td>
                        <td align="right">{{ this.data.amount }}</td>
                    </tr>
                    <tr>
                        <td align="left">费率</td>
                        <td align="right">{{ this.data.rate }}</td>
                    </tr>
                    <tr>
                        <td align="left">时间</td>
                        <td align="right">{{ this.data.time }}</td>
                    </tr>
                    <tr>
                        <td align="left">发起地址</td>
                        <td align="right">{{ this.data.from }}</td>
                    </tr>
                    <tr>
                        <td align="left">接收地址</td>
                        <td align="right">{{ this.data.to }}</td>
                    </tr>
                    <tr>
                        <td align="left">区块高度</td>
                        <td align="right">{{ this.data.height }}</td>
                    </tr>
                    <tr>
                        <td align="left">备注</td>
                        <td align="right">{{ this.data.text }}</td>
                    </tr>
                </table>               
            </Modal>
        </div>    
</template>
<script>
export default {
    name:'Home',
        data () {
            return {
                num:'',
                address: '',
                loading: false,
                modal:false,
                detail:false,
                currency:'SDA',
                limit: 10,
                more: false,
                SDA: '',
                columns: [
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '交易哈希',
                        key: 'hash',
                        render: (h, params) => {
                            return h('a', {
                                props: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        that = this.transactionList[params.index]
                                        this.data = {
                                            hash: that.hash,
                                            type: that.type,
                                            status: that.status,
                                            amount: that.amount,
                                            rate: that.rate,
                                            time: that.time,
                                            from: that.address,
                                            to: that.destination,
                                            height: that.height,
                                            text: that.text
                                        }
                                        this.detail = true
                                    }
                                }
                            }, params.row.hash)
                        }
                    },
                    {
                        title: '发起地址',
                        key: 'address'
                    },
                    {
                        title: '交易类型',
                        key: 'type'
                    },
                    {
                        title: '交易金额',
                        key: 'amount'
                    },
                    {
                        title: '交易备注',
                        key: 'text'
                    }
                ],
                transactionList: [],
                balanceList: [],
                symbol: '',
                symbolList: [],
                data: {
                    hash: '',
                    type: '',
                    status: '',
                    amount: '',
                    rate: '',
                    time: '',
                    from: '',
                    to: '',
                    height: '',
                    text: ''
                },
                paymentList: [],
                paymentInfo: {
                    to: '',
                    amount: '',
                    text: ''
                }
            }
        },

        created() {
            this.getSDA()
            this.secondBalance()
            this.transaction(this.limit)
        },

        methods: {
            //SDA余额
            getSDA() {
                this.axios.post(this.config.apiURL, JSON.stringify({
                    "method": "account_info",
                    "params": [
                        {
                            "ledger_index":"validated",
                            "account": this.$parent.account,//账户
                        }
                    ]
                })).then(({data}) => {
                    if (data.result.status == 'success') {
                        this.SDA = `${data.result.account_data.Balance / 1000000} SDA`
                    }
                    if (data.result.status == 'error') {
                        this.$parent.logintype = 1
                        this.SDA = `(${data.result.error}  ${data.result.error_message})`
                    }
                }).catch((e) => {
                    console.log(e)
                })
                setTimeout(() => {
                    this.getSDA()
                }, 5000)
            },

            //二级资产余额
            secondBalance() {
                this.axios.post(this.config.apiURL, JSON.stringify({
                    "method": "account_lines",
                    "params": [
                        {
                            "ledger_index":"validated",
                            "account": this.$parent.account,//账户
                            "limit": 5 //需要配置
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
                                    "account": val.account
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
                setTimeout(() => {
                    this.secondBalance()
                }, 5000)
            },

            showModal() {
                this.modal = true
                this.address = '',
                this.num = '',
                this.symbol = ''
            },

            //获取授信币种
            getSymbol() {
                this.axios.post(this.config.apiURL, JSON.stringify({
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
                        this.symbolList = keys
                    } else {
                        this.symbolList = []
                    }
                }).catch((e) => {
                    console.log(e)
                })
            },

            //交易记录
            transaction(limit) {
                this.axios.post(this.config.apiURL, JSON.stringify({
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
                                amount = `${value.tx.Amount / 1000000} SDA`
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
                                var get = `${value.tx.TakerGets / 1000000} SDA`
                            }
                            if (typeof(value.tx.TakerGets) == 'object') {
                                var get = `${value.tx.TakerGets.value} ${value.tx.TakerGets.currency}`
                            }
                            if (typeof(value.tx.TakerPays) == 'string') {
                                var pay = `${value.tx.TakerPays / 1000000} SDA`
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
                            status: value.meta.TransactionResult == 'tesSUCCESS' ? '成功' : '失败',
                            time: time
                        })
                        this.loading = false
                    })

                    //是否有下一页
                    if (res.data.result.hasOwnProperty("marker")) {
                        this.more = true
                        // this.limit = this.limit + 10
                    } else {
                        this.more = false
                    }

                    if (this.limit == 10) {//未点击加载更多
                        setTimeout(() => {
                            this.transaction(this.limit)
                        }, 5000)
                    } 
                }).catch((e) => {
                    console.log(e)
                })
            },  

            //加载更多
            loadmore() {
                this.loading = true
                this.limit = this.limit + 10
                this.transaction(this.limit)
            },


            //退出登陆
            logout () {
                this.$parent.islogin = false
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
            },

            // 授信,转账
            confirm(val) {
                this.loading = true
                const api = this.chainAPI
                //判断地址是否合法
                if (val == 'payment') {
                    var isAddress = api.isValidAddress(this.paymentInfo.to)
                } 
                if (val == 'trust_line') {
                    var isAddress = api.isValidAddress(this.address)
                }
                if (isAddress.wallet === false) {
                    this.$Message.error('请填写正确的地址')
                    this.loading = false
                    return false
                }
                //判断金额是否是大于0的数字
                if (val == 'payment') {
                    if (this.paymentInfo.amount <= 0 ) {
                        this.$Message.error('转账金额必须是大于0的数字')
                        this.loading = false
                        return false
                    } 
                } 
                if (val == 'trust_line') {
                    if (this.num < 0 ) {
                        this.$Message.error('授信币种的数量不能小于0')
                        this.loading = false
                        return false
                    } 
                    if (this.symbol == '') {
                        this.$Message.error('请填写或选择授信币种')
                        this.loading = false
                        return false
                    }
                }

                this.axios.post(this.config.apiURL, JSON.stringify({
                    "method": "account_info",
                    "params": [
                        {
                            "account": this.$parent.account,//账户
                        }
                    ]
                })).then(({data}) => {
                    const sequence = data.result.account_data.Sequence
                    
                    if (val == 'trust_line') {
                        const issuer = this.address
                        var txJson = this.prepareTrustline(this.$parent.account, this.num, this.symbol, issuer, sequence)
                    } else if (val == 'payment') {
                        var str = this.currency
                        let account = str.substring(str.indexOf('(')+1,str.lastIndexOf(')'))
                        var currency = "SDA"
                        if (str.indexOf('(') != -1) {
                            currency = str.substring(0, str.indexOf('('))
                        } 
                        var txJson = this.preparePayment(this.$parent.account, this.paymentInfo.to, this.paymentInfo.amount, currency, account, this.paymentInfo.text, sequence)
                    }
                    const signData = api.sign(txJson, this.$parent.secret); // 交易签名
                    const sign = signData.signedTransaction
                    this.submit(sign)
                }).catch((e) => {
                    console.log(e)
                    this.loading = false
                })
            },


            submit(sign) {
                this.axios.post(this.config.apiURL, JSON.stringify({
                    "method": "submit",
                    "params": [
                        {
                            "tx_blob": sign,
                        }
                    ]
                })).then(({data}) => {
                    if (data.result.engine_result == 'tesSUCCESS') {
                        this.$Message.success('操作成功')
                        this.paymentInfo.to = ''
                        this.paymentInfo.amount = ''
                        this.paymentInfo.text = ''
                    } else {
                        this.$Message.error(data.result.engine_result_message)
                    }
                }).catch((e) => {
                    console.log(e)
                })
                this.loading = false
            },

            prepareTrustline (address, amount, currency, issuer, sequence) {
                const txJson = {
                  'TransactionType': 'TrustSet',
                  'Flags': amount == 0 ? 131072 : 262144,
                  'Account': address,
                  'LimitAmount': {
                    'value': amount,
                    'currency': currency,
                    'issuer': issuer
                  },
                  'Fee': '100', // 可以放到常量
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
                  'Fee': '100', // 可以放到常量
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


            upper() {
                console.log(11)
            },
           
            reload() {
                this.limit = 10
                this.transaction(this.limit)
            }
            
        },
}
</script>