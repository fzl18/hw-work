<template>
    <div class="c2c">
        <section class="c2cindex container">
            <div v-if="loginGetStatus && loginStatus && auth == 2">
                <ul class="type">
                    <li @click="pageChange('clear','hedging')" :class="curType =='hedging' ? 'cur':''">{{lang[local].c2cCurrencyT1}}</li>
                    <li @click="pageChange('clear','history')" :class="curType =='history' ? 'cur':''">{{lang[local].c2cCurrencyT2}}</li>
                    <li @click="pageChange('clear','account')" :class="curType =='account' ? 'cur':''">{{lang[local].c2cCurrencyT3}}</li>
                </ul>
                <section v-if="curType =='hedging'">
                    <div class="list">
                        <div><Button size="large" type="primary" :loading="false" @click="handleHedging('query',1)" style="padding:11px 45px;margin-bottom:20px;font-size:16px">{{lang[local].c2cCurrencyT4}}</Button></div>
                        <dl>
                            <dt>
                                <ul >
                                    <li><Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll"></Checkbox></li>
                                    <li align="left" style="paddingLeft:15px;">{{lang[local].c2cOrderNO}}</li>
                                    <li>{{lang[local].transferType}}</li>
                                    <li>{{lang[local].c2cCoin}}</li>
                                    <li>{{lang[local].num}}</li>
                                    <li>{{lang[local].unitPrice}}</li>
                                    <li>{{lang[local].addOrderTip3}}</li>
                                    <li>{{lang[local].time}}</li>
                                    <li>{{lang[local].operation}}</li>
                                    </CheckboxGroup>
                                </ul>
                            </dt>
                            <dd v-if="loading" style="height:100px"><load/></dd>
                            <dd v-if="!loading && transactionHedgingList.length == 0" style="text-algin:center;width:100%">{{lang[local].emptyData}}</dd>
                            <dd v-for="(item,index) in transactionHedgingList">
                                <ul>
                                    <CheckboxGroup v-model="checkGroup" @on-change="checkAllGroupChange">
                                    <li><Checkbox :label="item.id" :disabled="item.hedging_status==0 ? false :true"><span></span></Checkbox></li>
                                    <li> {{item.orderid}}</li>
                                    <li class="buy">{{lang[local].c2cSell}}</li>
                                    <li>{{item.symbol.toUpperCase()}}</li>
                                    <li>{{item.amount}}</li>
                                    <li>{{item.price}}{{item.currency_tag}}</li>
                                    <li>{{item.money}}{{item.currency_tag}}</li>
                                    <li>{{localDate(item.createtime)}}</li>
                                    <li>{{item.hedging_status ? lang[local].c2cCurrencyT5 : ''}}<Button class="blue" v-if="item.hedging_status==0" size="large" type="text" :loading="false" @click="handleHedging('query',0,item.id)" style="padding:0;">{{lang[local].c2cCurrencyT4}}</Button></li>
                                    </CheckboxGroup>
                                </ul>
                            </dd>
                        </dl>
                    </div>
                    <div class="pageList">
                        <page :page="page && page" @pageChange="pageChange" v-if="page.totalPage > 0" />
                    </div>
                </section>
                <section v-if="curType =='history'">
                    <div class="list">
                        <dl>
                            <dt>
                                <ul > 
                                    <li align="left" style="paddingLeft:15px;width:25%">{{lang[local].time}}</li>
                                    <li style="width:15%">{{lang[local].c2cCoin}}</li>
                                    <li style="width:15%">{{lang[local].num}}</li>
                                    <li style="width:15%">{{lang[local].price}}</li>
                                    <li style="width:15%">{{lang[local].addOrderTip3}}</li>
                                    <li style="width:15%">{{lang[local].c2cTit2}}</li>
                                </ul>
                            </dt>
                            <dd v-if="loading" style="height:100px"><load/></dd>
                            <dd v-if="!loading && hedgingHistoryList.length == 0" style="text-algin:center;width:100%">{{lang[local].emptyData}}</dd>
                            <dd v-for="(item,index) in hedgingHistoryList">
                                <ul>
                                    <li align="left" style="paddingLeft:15px;width:25%"> {{localDate(item.created_at)}}</li>
                                    <li style="width:15%">{{item.to_currency}}</li>
                                    <li style="width:15%">{{item.to_amount}}</li>
                                    <li style="width:15%">{{item.price + ' ' +item.from_currency}}</li>
                                    <li style="width:15%">{{item.from_amount}}</li>
                                    <li style="width:15%">--</li>
                                
                                </ul>
                            </dd>
                        </dl>
                    </div>
                    <div class="pageList">
                        <page :page="page && page" @pageChange="pageChange" v-if="page.totalPage > 0" />
                    </div>
                </section>
                <section v-if="curType =='account'" class="account">
                    <Row>
                        <Col span="2">
                            <div style="border-radius:50%;background:#57a3f3;text-align:center;height:60px;width:60px;line-height:60px;"><i class="iconfont icon-qian" style="font-size:26px;color:#fff;"></i></div>
                        </Col>                        
                        <Col span="20" style="line-height:30px;">
                            <div>{{username}}</div>
                            <Button size="large" type="text" style="background:#57a3f3;color:#fff;border-radius:20px;padding: 0px 10px;font-size:14px;" @click="cancelCoinSquare">{{lang[local].c2cCurrencyT13}}</Button>
                        </Col>
                    </Row>
                    <div class="coin" style="padding:0 30px;margin:10px 0 8px 0;height:50px;line-height:50px;">
                        <Row>
                            <Col span="18" style="font-weight:bold;font-size:15px">{{lang[local].c2cCurrencyT12}}</Col>
                            <Col span="6" style="text-align:right;font-size:15px">
                                <i-switch v-model="isChecked" size="large" >
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                                    <span style="font-size:15px;margin-left:10px">{{lang[local].c2cCurrencyT15}}</span> 
                            </Col>
                        </Row>
                    </div>
                    <div class="list">
                        <dl>
                            <dt>
                                <ul > 
                                    <li align="left" style="paddingLeft:15px;width:40%">{{lang[local].c2cCoin}}</li>
                                    <li style="width:40%">{{lang[local].icoUse}}</li>
                                    <li style="width:20%">{{lang[local].c2cCurrencyT14}}</li>
                                </ul>
                            </dt>
                            <dd v-if="loading" style="height:100px"><load/></dd>
                            <dd v-if="!loading && coinSquareAccountList.length == 0" style="text-algin:center;width:100%">{{lang[local].emptyData}}</dd>
                            <dd v-for="(item,index) in coinSquareAccountList" v-if="isChecked ? item.tradable_amount > 0 : true">
                                <ul >
                                    <li align="left" style="paddingLeft:15px;width:40%"> {{item.coin}}</li>
                                    <li style="width:40%">{{item.available}}</li>
                                    <li style="width:20%">{{item.tradable_amount}}</li>
                                </ul>
                            </dd>
                        </dl>
                    </div>
                </section>
            </div>
            <Modal
            v-model="loginModle"
            :closable = false
            :footer-hide = true
            :mask-closable = false
            width="800"
            class-name="vertical-center-modal loginfcoin" >
                <h1 style="text-align:center">{{lang[local].c2cCurrencyBox1}}</h1>
                <table>
                    <tr>
                        <td>API_KEY   </td>
                        <td align="right"><Input size="large" v-model="submit.apikey" :placeholder="lang[local].c2cIput" /></td>
                    </tr>
                    <tr>
                        <td>AUTH_KEY</td>
                        <td align="right"><Input size="large" v-model="submit.authkey" :placeholder="lang[local].c2cIput" /></td>
                    </tr>
                    <tr>
                        <td>CLINET_ID</td>
                        <td align="right"><Input size="large" v-model="submit.clientid" :placeholder="lang[local].c2cIput" /></td>
                    </tr>
                    <tr>
                        <td>UserName</td>
                        <td align="right"><Input size="large" v-model="submit.username" :placeholder="lang[local].c2cIput" /></td>
                    </tr>
                    <tr>
                        <td>Uid</td>
                        <td align="right"><Input size="large" v-model="submit.uid" :placeholder="lang[local].c2cIput" /></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <Row style="margin-top:50px">                            
                                <Col span="24" ><Button type="primary" :loading="btnLoading" size="large" @click="loginCoinSquare">{{lang[local].apply36}}</Button></Col>
                                <!-- <Col span="12"><Button type="primary" size="large" @click="loginModle = false;$router.back()">{{lang[local].apply48}}</Button></Col> -->
                            </Row>
                        </td>
                    </tr>
                </table>
            </Modal>
             <Modal
            v-model="hedgingModal"
            :closable = false
            :footer-hide = true
            :mask-closable = false
            class-name="vertical-center-modal confirm" >
                <h1>{{lang[local].c2cCurrencyT7}}</h1>
                <div class="loading" v-if="canbeused"><load/></div>
                <table>
                    <tr>
                        <td width="60%">{{lang[local].c2cCurrencyT8}}   </td>
                        <td >{{lang[local].c2cCurrencyT9}}   </td>
                    </tr>
                    <tr>
                        <td class="tsell">{{queryinfo.coin + '/' + queryinfo.currency}}</td>
                        <td class="tbuy">{{queryinfo.coin_amount + queryinfo.coin}}</td>
                    </tr>
                    <tr>
                        <td style="padding-top:30px;">{{lang[local].c2cCurrencyT10}} </td>
                        <td style="padding-top:30px;">{{lang[local].price}} </td>
                    </tr>
                    <tr>
                        <td class="b">{{queryinfo.currency_amount + queryinfo.currency}}</td>
                        <td class="b">{{queryinfo.price + queryinfo.currency}}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="tip">
                            {{lang[local].c2cCurrencyT11}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <Row style="margin-top:50px">                            
                                <Col span="12"><Button type="primary" :disabled="canbeused" size="large" @click="handleHedging('submit',isAll,chooseId)">{{lang[local].apply36}}</Button></Col>
                                <Col span="12" style="text-align:right"><Button type="text" size="large" @click="hedgingModal = false;init()">{{lang[local].cancel}}</Button></Col>
                            </Row>
                        </td>
                    </tr>
                </table>
            </Modal>
        </section>
    </div>
</template>

<script>
import {mapState} from "vuex";
export default {
    name:'currency',
    data(){
        return {
            page : {
                currPage : 0,
                totalPage : 0,
                pageSize : 10,
                totalCount : 0,
            },
            loginModle:false,
            submit:{},
            curType:'hedging',
            hedgingModal:false,
            loading:true,
            isChecked:false,
            auth:0,
            checkGroup:[],
            checkAll:false,
            indeterminate: false,
            transactionHedgingList:[],
            hedgingHistoryList:[],
            coinSquareAccountList:[],
            btnLoading:false,
            queryinfo:{
                coin:"--",
                coin_amount:"--",
                currency:"--",
                currency_amount:"--",
                price:"--"
            },
            chooseId:null,
            canbeused:true,
            isAll:0,
            username:'',
        }
    },
    computed : {
        ...mapState('login',['loginInfo','loginStatus','loginGetStatus'])
    },
    mounted(){
        this.getTransactionHedging()
    },
    methods:{
        init(){          
            this.queryinfo={
                coin:"--",
                coin_amount:"--",
                currency:"--",
                currency_amount:"--",
                price:"--"
            }
        },
        pageChange (page,val=this.curType,){
            if(page == 'clear'){
                this.page = {
                    currPage : 0,
                    totalPage : 0,
                    pageSize : 10,
                    totalCount : 0,
                }
            }else{
                this.page = page
            }
            this.transactionHedgingList=[]
            this.hedgingHistoryList=[]
            this.coinSquareAccountList=[]
            this.handleClass(val)
            if(val=='history'){
                this.init()
                this.getHedgingHistory()
            }else if(val=='hedging'){
                this.init()
                this.getTransactionHedging()
            }else{
                this.init()
                this.getCoinSquareAccount()
            }
        },
        handleClass(val){
            this.curType = val
            this.loading = true
        },
        handleHedging(type,isAll,orderid){
            if(type == 'query'){
                this.isAll = isAll
                if(isAll){
                    if(this.checkGroup.length >0){                        
                        const choose = []
                        this.checkGroup.forEach(
                            v => this.transactionHedgingList.forEach(d=>{
                                if(d.id == v){
                                    choose.push(d)
                                }
                            })
                        )
                        const base = choose[0].symbol
                        let isSame = choose.every(d => {
                            return d.symbol == base
                        })
                        if(isSame){                    
                            this.hedgingModal = true                            
                            this.hedging(type,this.checkGroup.join())
                        }else{
                            this.$store.commit('msg/err', this.lang[this.local].c2cCurrencyT16)
                        }
                    }
                }else{
                    this.hedgingModal = true
                    this.chooseId = orderid
                    this.hedging(type,orderid)
                }                
            }else if(type == 'submit'){
                if(isAll){
                    this.hedging(type,this.checkGroup.join())
                }else{
                    this.hedging(type,orderid)
                }                
            }else{

            }
        },

        hedging(type,orderid){
            this.canbeused = true
            this.axios({
                url : this.api.hedging,
                data : {
                    type,
                    'order_id':orderid,
                    'coin_amount':this.queryinfo.coin_amount
                }
            }).then((res) => {
                if(type == 'query'){
                    this.queryinfo = res.data
                    this.canbeused = false
                }else{
                    this.hedgingModal = false
                    this.$store.commit('msg/add', res.message)
                    this.getTransactionHedging()
                }
                
            }).catch((err) => {
                this.$store.commit('msg/err', err.message)
                this.canbeused = false
            });
        },
        delGroup(){
                if(this.checkGroup.length == 0){
                    return
                }
                this.axios({
                    url : this.api.chexiao,
                    data : {
                        order_id : this.checkGroup.join()
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', res.message );
                    // this.upnum++
                    setTimeout(()=>{
                        location.reload()
                    },500)
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message);
                });
            },
        handleCheckAll () {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                if(this.transactionHedgingList.length !=0){
                    this.transactionHedgingList.map(d =>{
                        if(d.hedging_status == 0){
                            this.checkGroup.push(d.id)
                        }
                    })
                    console.log(this.checkGroup);
                    
                }
            } else {
                this.checkGroup = [];
            }
        },
        checkAllGroupChange (data) {
            if (data.length === this.page.pageSize) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        getTransactionHedging(){
            this.loading = true
            this.axios({
                url : this.api.transactionHedging,
                data : {
                    ...this.page
                }
            }).then((res) => {
                this.loginModle = false
                this.auth = 2
                this.transactionHedgingList = res.data.list
                this.page = res.data.page
                this.loading = false
            }).catch((err) => {
                this.$store.commit('msg/err', err.message);
                if(err.code == 84101){
                    this.$router.push('/')
                }else if(err.code == 84102){
                    this.$router.push('/')
                }else if(err.code == 84103){
                    this.loginModle = true
                }else{

                }
            });
        },
        getHedgingHistory(){
            this.loading = true
            this.axios({
                url : this.api.hedgingHistory,
                data : {
                    ...this.page,
                    pageSize:20,
                }
            }).then((res) => {
                this.loginModle = false
                this.auth = 2
                this.hedgingHistoryList = res.data.list
                this.page = res.data.page
                this.loading = false
            }).catch((err) => {
                this.$store.commit('msg/err', err.message);
            });
        },
        getCoinSquareAccount(){
            this.loading = true
            this.axios({
                url : this.api.coinSquareAccount,
                data : {
                }
            }).then((res) => {
                this.loginModle = false
                this.auth = 2
                this.coinSquareAccountList = Object.keys(res.data.accounts).map(d=>{ return { coin:d , ...res.data.accounts[d] }})
                this.username = res.data.username
                this.loading = false
            }).catch((err) => {
                this.$store.commit('msg/err', err.message);
            });
        },
        cancelCoinSquare(){
            this.axios({
                url : this.api.cancelCoinSquare,
                data : {
                }
            }).then((res) => {
                this.loginModle = true
                this.auth = 0                
                this.btnLoading = false
            }).catch((err) => {
                this.$store.commit('msg/err', err.message);
            });
        },
        loginCoinSquare(){
            this.btnLoading = true
            if(Object.keys(this.submit).length >0){
                if(!this.submit.apikey || !this.submit.authkey || !this.submit.clientid || !this.submit.uid || !this.submit.username){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1);
                    console.log(this.submit)
                    return
                }
                this.axios({
                    url : this.api.loginCoinSquare,
                    data : {
                        'api_key':this.submit.apikey,
                        'auth_key':this.submit.authkey,
                        'client_id':this.submit.clientid,
                        'uid':this.submit.uid,
                        'username':this.submit.username,
                    }
                }).then((res) => {
                    this.btnLoading = false
                    this.getTransactionHedging()
                    this.loginModle = false
                    this.auth = 2
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message);
                    this.btnLoading = false
                });
            }else{
                this.$store.commit('msg/err', this.lang[this.local].transferModeErr1);
                    return
            }            
        }
    }
}
</script>

<style lang="scss" scoped>
.list{
    overflow: hidden;
    margin-bottom:60px;
    h3{
        border-left:3px solid #FF6600;
        padding-left:15px;
        margin-bottom:20px;
    }
    li{
        float: left;white-space:nowrap;
        .iconfont{font-size:22px;margin-right:5px;}
        &:nth-child(1){width:3%}
        &:nth-child(2){width:10%}
        &:nth-child(3){width:15%}
        &:nth-child(4){width:10%}
        &:nth-child(5){width:10%}
        &:nth-child(6){width:10%}
        &:nth-child(7){width:15%}
        &:nth-child(8){width:17%}
        &:nth-child(9){width:10%;text-align: center}
    }
    dt{
        background: #F8F8F8;
        overflow: hidden;
        height:50px;
        line-height: 50px;
        text-align:center;
    //    border:1px dashed #333;
    }
        dd{
        height:50px;
        line-height: 50px;
        text-align: center;
        clear: both;
        &:nth-child(odd){
            background: #F8F8F8
        }
        
        &:hover{background: #eee}
        li{padding:0 15px;
            &:first-child{
                text-align: left;
            }
        }
        
    }
}
.cursor{
    cursor: pointer;
}
.account{
    width:70%;
    margin:auto;
}
.loginfcoin{
    color:#999;
    .tip{
        font-size:16px;
        margin:30px 0;
    }
    table{
        margin:0 auto;
        margin-top:30px;        
        font-size:15px;
        width: 60%;
        .bline{
            border-bottom: 1px dotted #ccc
        }
        tr:last-child{text-align: center;}  
        td{
            line-height: 50px;
            p{line-height: 26px;}
        }
    }
}

.confirm{
    color:#777;
    .tip{
        font-size:15px;
        padding-top:30px;
        color:#999
    }
    .loading{
        position: absolute;
        top:30%;
        left:40%
    }
    table{
        width:100%;
        margin:0 auto;
        margin-top:30px;        
        font-size:16px;
        td{
            line-height: 30px;
            p{line-height: 26px;}
            &.b{color:#333;font-weight: bold}
            &:nth-child(2){
                text-align: left;
            }
        }
    }
}
</style>
