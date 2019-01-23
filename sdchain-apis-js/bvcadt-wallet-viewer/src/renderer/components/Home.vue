<template>
    <div class="layout">
            <Layout>
                <Header>
                    <Menu mode="horizontal" theme="dark" active-name="1">
                        <div class="layout-logo"><img src="../assets/logo.png" alt=""><span>{{Lang[useLang].title}}</span> <ChooseLang :top="true"/></div>
                        <div class="layout-nav">
                            <Button icon="md-log-out" size="small" type='primary' class="b2" @click="logout">{{Lang[useLang].logout}}</Button>
                        </div>
                    </Menu>
                </Header>
                <Content :style="{padding: '0 50px'}">
                    <div style="min-height:calc(100vh - 140px);margin-top:20px">
                        <Row>
                            <Col span="24" style="margin-bottom:20px">
                                <Card>
                                    <p slot="title" style="font-weight:400;height:32px;">
                                        {{Lang[useLang].addr}}：{{$parent.account}}
                                        <Tooltip :content="Lang[useLang].qr">
                                        <Button type='primary' @click="qr = true" shape="circle" style="margin:0 10px;padding:2px 5px"><Icon type="md-qr-scanner" style="line-height:16px;font-size:12px"/></Button>
                                        </Tooltip>
                                        <Tooltip :content="Lang[useLang].copy">
                                            <Button type='primary' style="padding:2px 5px" shape="circle" v-clipboard:copy="$parent.account"
                                            v-clipboard:success="copysuc"
                                            v-clipboard:error="copyerr">
                                            <Icon type="ios-photos" style="line-height:16px;font-size:12px"/></Button>
                                        </Tooltip>
                                        <Button v-if="$parent.logintype == 2" size="small" icon="md-add" type='primary' @click="showModal" style="margin-left:10px">{{Lang[useLang].addCredit}}</Button>

                                    </p>
                                    
                                    <Row style="line-height:30px">
                                        <Col><table><tr><td valign="top">{{Lang[useLang].balance}}：</td><td>
                                            <p> <span style="color:#A1656D;font-weight:bold;font-size:14px">{{ this.SDA }}</span></p>
                                            <p v-for="(item, index) in balanceList" :key="index"> <span style="color:#A1656D;font-size:12;">{{ item.balance }}</span> ({{ item.account }})</p>
                                        </td></tr></table></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span="24" style="margin-bottom:20px" v-if="$parent.logintype == 2">
                                <Card>
                                    <p slot="title">{{Lang[useLang].transferAccount}}</p>
                                    <Row style="line-height:40px">
                                        <Col> 
                                            <Input v-model="paymentInfo.to" style="width:400px" size="large">
                                            <span slot="prepend">{{Lang[useLang].destination}}</span>
                                            </Input>
                                        </Col>
                                        <Col style="margin:20px 0">                                                
                                            <Input v-model="paymentInfo.amount" @keyup.native="checkpayment($event)" style="width:400px;" size="large" >
                                            <span slot="prepend">{{Lang[useLang].amount}}</span>
                                                <Select class="currency_choose" v-model="currency" slot="append" style="width:100px">
                                                    <Option value="BVC">{{this.config.currency}}</Option>
                                                    <Option v-for="(item, index) in paymentList" :value="item.symbol" :key="index">{{ item.symbol }}</Option>
                                                </Select>
                                            </Input>
                                        </Col>
                                        <Col span="24">                                                
                                            <Input style="width:400px" v-model="paymentInfo.text" type="textarea" :autosize="{minRows: 3,maxRows: 5}" :placeholder="Lang[useLang].infoTxt4 + ' ' + Lang[useLang].memo + '...'" >
                                            </Input>
                                        </Col>
                                        <Button type="primary" :loading="loading" style="width:100px;margin-top:20px;" @click="confirm('payment')"> {{Lang[useLang].OK}} </Button>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span="24" >
                                <Card dis-hover class="tx">
                                    <p slot="title" style="height:24px">{{Lang[useLang].transactionRecord}} <Button size="small" type="info" ghost @click="reload" :loading="loading" style="float:right"> {{Lang[useLang].reload}} </Button></p>
                                    <Table stripe :columns="columns" :data="transactionList" style="border:none" :no-data-text="Lang[useLang].empty"></Table>
                                    <div style="text-align:center;margin:20px auto"><Button type="info" ghost @click="loadmore" :loading="loading" v-show="more"> {{Lang[useLang].loadMore}} </Button></div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Content>
                <Footer class="layout-footer-center">{{Lang[useLang].copyright}} </Footer>
            </Layout>
            <Modal
                v-model="modal"
                :mask-closable="false"
                title=""
                
                class-name="vertical-center-modal">
                <Row style="padding:30px 0 10px 30px;line-height:50px;font-size:15px">
                    <Col span="24">{{Lang[useLang].account}}: <Input size="large" v-model="address" :placeholder="Lang[useLang].infoTxt4 + '...'" style="width:350px" @on-keyup="getSymbol" /></Col>
                    <Col span="24">
                    {{Lang[useLang].currency}}: 
                    <Input  size="large" @keyup.native="checknum" v-model.trim="num" :placeholder="Lang[useLang].infoTxt4 + Lang[useLang].amount" style="width:100px"></Input>
                    <AutoComplete
                        @keyup.native="upper"
                        @on-change="changeCurrency"
                        v-model="symbol"
                        :data="symbolList"
                        size="large"
                        :placeholder="Lang[useLang].infoTxt5"
                        style="width:120px">
                    </AutoComplete>
                    </Col>
                </Row> 
                <div slot="footer">
                    <Button type="text" size="large" @click="modal=false">{{ Lang[useLang].cancal }}</Button>
                    <Button type="info" :disabled="disabled" size="large" @click="confirm('trust_line')">{{ Lang[useLang].OK }}</Button>
                </div>
            </Modal>
            <Modal
                v-model="detail"
                :title="`${Lang[useLang].transactionRecord} -- ${this.data.status == 'tesSUCCESS' ? Lang[useLang].infoTxt7 : Lang[useLang].infoTxt8}`"
                :footer-hide="true"
                width="700"
                class-name="vertical-center-modal">
                <table width="100%" class="list">
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[0]:null}}</td>
                        <td align="left"> {{ this.data.hash }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[6]:null}}</td>
                        <td align="left">{{ this.data.from }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[7]:null}}</td>
                        <td align="left">{{ this.data.to }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[1]:null}}</td>
                        <td align="left">{{ this.data.type }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[3]:null}}</td>
                        <td align="left">{{ this.data.amount }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[8]:null}}</td>
                        <td align="left">{{ this.data.height }}</td>
                    </tr>
                     <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[5]:null}}</td>
                        <td align="left">{{ this.data.time }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[4]:null}}</td>
                        <td align="left">{{ this.data.rate }}</td>
                    </tr>
                    <tr>
                        <td align="right">{{Lang[useLang].tabTit2 ? Lang[useLang].tabTit2[9]:null}}</td>
                        <td align="left"><div style="word-wrap:break-word;">{{ this.data.text }}</div></td>
                    </tr>
                </table>               
            </Modal>
            <Modal
                :title="Lang[useLang].qr"
                footer-hide
                v-model="qr"
                class-name="vertical-center-modal">
                <div style="text-align:center;margin-left:30px;">
                    <qrcode :value="$parent.account" :options="{ size: 250 }"></qrcode>
                    <p style="font-size:15px">{{Lang[useLang].addr}} : {{$parent.account}}</p>
                </div>
            </Modal>
        </div>    
</template>
<script>
import Qrcode from '@xkeshi/vue-qrcode'
import ChooseLang from "./ChooseLang"
export default {
    name:'Home',
    components: {
    qrcode: Qrcode, ChooseLang
    },
        data () {
            return {
                disabled: true,
                bvcTimeout: '',
                secondTimeout: '',
                transactionTimeout: '',
                num:'',
                address: '',
                loading: false,
                modal:false,
                detail:false,
                currency:'BVC',
                limit: 10,
                more: false,
                SDA: '',
                columns: [],
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
                },
                qr:false
            }
        },
        
        created() {
            this.getSDA()
            this.secondBalance()
            this.transaction(this.limit)
        },
        mounted(){
            this.setColumns()
        },
        watch:{
            'useLang'(n,o){
                this.columns = []
                this.setColumns()
            }
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
                        this.SDA = `${data.result.account_data.Balance / 1000000} ${this.config.currency}`
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
                })
                this.bvcTimeout = setTimeout(() => {
                    this.getSDA()
                }, this.config.timeout)
            },

            //二级资产余额
            secondBalance() {
                this.axios.post(this.config.apiURL, JSON.stringify({
                    "method": "account_lines",
                    "params": [
                        {
                            "ledger_index":"validated",
                            "account": this.$parent.account,//账户
                            "limit": this.config.limit //需要配置
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
                this.secondTimeout = setTimeout(() => {
                    this.secondBalance()
                }, this.config.timeout)
            },

            showModal() {
                this.modal = true
                this.address = this.config.issueAddress,
                this.num = '',
                this.symbol = ''
                if (this.address != '') {
                    this.getSymbol()
                }
            },

            //获取授信币种
            getSymbol() {
                this.disabled = true
                this.num = ''
                this.symbol = ''
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
                        this.list = data.result.obligations
                    } else {
                        this.symbolList = []
                    }
                }).catch((e) => {
                    console.log(e)
                    return false
                })

                //判断
                this.axios.post(this.config.apiURL, JSON.stringify({
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
                                amount = `${value.tx.Amount / 1000000} ${this.config.currency}`
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
                                var get = `${value.tx.TakerGets / 1000000} ${this.config.currency}`
                            }
                            if (typeof(value.tx.TakerGets) == 'object') {
                                var get = `${value.tx.TakerGets.value} ${value.tx.TakerGets.currency}`
                            }
                            if (typeof(value.tx.TakerPays) == 'string') {
                                var pay = `${value.tx.TakerPays / 1000000} ${this.config.currency}`
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
                        this.loading = false
                    })

                    //是否有下一页
                    if (res.data.result.hasOwnProperty("marker")) {
                        this.more = true
                    } else {
                        this.more = false
                    }

                    if (this.limit == 10) {//未点击加载更多
                        this.transactionTimeout = setTimeout(() => {
                            this.transaction(this.limit)
                        }, this.config.timeout)
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
                clearTimeout(this.bvcTimeout)
                clearTimeout(this.secondTimeout)
                clearTimeout(this.transactionTimeout)
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
                    this.$Message.error(this.Lang[this.useLang].infoTxt9)
                    this.loading = false
                    return false
                }
                //判断金额是否是大于0的数字
                if (val == 'payment') {
                    if (this.paymentInfo.amount <= 0 ) {
                        this.$Message.error(this.Lang[this.useLang].infoTxt10)
                        this.loading = false
                        return false
                    } 
                }
                   
                if (val == 'trust_line') {
                    if (this.num == '') {
                        this.$Message.error(this.Lang[this.useLang].infoTxt11)
                        this.loading = false
                        return false
                    }
                    if (this.symbol == '') {
                        this.$Message.error(this.Lang[this.useLang].infoTxt12)
                        this.loading = false
                        return false
                    }
                     if (this.symbol.length < 2) {
                        this.$Message.error(this.Lang[this.useLang].infoTxt13)
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
                        var currency = this.config.currency
                        if (str.indexOf('(') != -1) {
                            currency = str.substring(0, str.indexOf('(') - 1)
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
                        this.$Message.success(this.Lang[this.useLang].infoTxt3)
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
                  'Flags': 131072,
                  'Account': address,
                  'LimitAmount': {
                    'value': amount,
                    'currency': currency,
                    'issuer': issuer
                  },
                  'Fee': this.config.fee,
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
                  'Fee': this.config.fee, 
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
                var pattern = /^[A-Za-z0-9]+$/
                if (!pattern.test(this.symbol) || this.symbol.length > 5) {
                    this.symbol = ''
                } else {
                    this.symbol = this.symbol.toUpperCase() //转大写
                }
            },
           
            reload() {
                clearTimeout(this.transactionTimeout)
                this.limit = 10
                this.transaction(this.limit)
            },
            setColumns(){                
                this.columns.push(                
                    {
                        title: this.Lang[this.useLang].tabTit[1],
                        key: 'hash',
                        render: (h, params) => {
                            return h('a', {
                                class: params.row.status == 'tesSUCCESS' ? 'green' : 'red',
                                props: {
                                    href: 'javascript:;',
                                },
                                on: {
                                    click: () => {
                                        var that = this.transactionList[params.index]
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
                        title: this.Lang[this.useLang].tabTit[2],
                        key: 'address',
                        render: (h, params) => {
                            return h('span', {
                                class: 'address'
                            },params.row.address)
                        }
                    },
                    {
                        title: this.Lang[this.useLang].tabTit[3],
                        key: 'type',
                        width: 180
                    },
                    {
                        title: this.Lang[this.useLang].tabTit[5],
                        key: 'amount',
                        width: 200
                    },
                )
            },

            checknum() {
                this.num = this.num.replace(/[^\d]/g,'')
            },

            checkpayment(event) {
                this.paymentInfo.amount = this.paymentInfo.amount.replace(/[^\.\d]/g,'')
                if (this.paymentInfo.amount.substr(0, 1) == '.') {
                     this.paymentInfo.amount = ''
                     return false
                }
                var count = this.paymentInfo.amount.split('.').length - 1
                if (count > 1) {
                    this.paymentInfo.amount = this.paymentInfo.amount.substring(0, this.paymentInfo.amount.length - 1)
                }
                if (count == 1) {
                    let index = this.paymentInfo.amount.indexOf('.');
                    let length = this.paymentInfo.amount.substring(index + 1).length
                    if (length > this.config.decimalLimit) {
                        this.paymentInfo.amount = this.paymentInfo.amount.substring(0, index + this.config.decimalLimit + 1)
                    }
                }
            },

            changeCurrency() {
                this.num = Math.ceil(this.list[this.symbol])
            },
            copysuc(e){
                this.$Message.success(this.Lang[this.useLang].copy + this.Lang[this.useLang].infoTxt7)
            },
            copyerr(e){
                this.$Message.error(this.Lang[this.useLang].copy + this.Lang[this.useLang].infoTxt8)
            },
            
        },
}
</script>

<style>
    .red, .green, .address{
        color:red;
        text-overflow: ellipsis;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
    .address{color:#555}
    .green{color:green}
    .currency_choose li{text-align: left;}
</style>
