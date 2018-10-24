<template>
<div class="c2c">
    <section class="c2cindex container">
        <ul class="type">
            <li @click="handleClass('buy')" :class="curType =='buy' ? 'cur':''">{{lang[local].c2cBuy}}</li>
            <li @click="handleClass('sell')" :class="curType =='sell' ? 'cur':''">{{lang[local].c2cSell}}</li>
            <li v-if="loginGetStatus && loginStatus " @click="handleClass('myOrder')" :class="curType =='myOrder' ? 'cur':''">{{lang[local].c2cmyOrder}}</li>
        </ul>
        <div class="seller" v-if="curType == 'myOrder' && status == 4 ">
            <Row>
                <Col span="12" class="lt">
                    <h2>{{businessInfo.name}}<i class="iconfont icon-bianji org" style="font-size:22px;cursor: pointer;margin:0 20px" @click="editBizName = true"/></h2>
                    <div>{{lang[local].registerTime}}：{{localDate(businessInfo.checked_time)}}</div>
                </Col>
                <Col span="12" class="rt">
                    <ul>
                        <li><span>{{businessInfo.deposit}}</span><br/>{{lang[local].bizDeposit}}</li>
                        <li><span>{{businessInfo.month_orders}}</span><br/>{{lang[local].monthOrders}}</li>
                        <li><span>{{businessInfo.total_orders}}</span><br/>{{lang[local].totalOrders}}</li>
                        <li><span>{{businessInfo.order_rate}}</span><br/>{{lang[local].orderRate}}</li>
                    </ul>
                </Col>
            </Row>
        </div>
        <div class="coin" :style="status!=4 && curType == 'myOrder'? 'background:none;border:none':''">
            <div class="tit" v-if="curType != 'myOrder'">
                <a v-for="(item,index) in coinList" href="javascript:;" @click="changeCoin(index)" :class="curCoin == index ?'cur':''">{{item.toUpperCase()}}</a>
            </div>
            <div class="tit" v-if="curType == 'myOrder'">
                <Button v-if="status==4" @click="addOrder" size="large" type="primary" ><i class="iconfont icon-tianjia" style="fontSize:20px;margin-right:10px;"/> {{lang[local].c2caddOrder}}</Button>
                <Button v-if="status && status <= 3 || status == 5" size="large" type="primary" :disabled="status == 2 || status == 5 ? true : false" :style="status == 2 || status == 5 ? 'background:#777;color:#fff;':''" @click="applyBiz"> <i class="iconfont icon-tianjia" style="fontSize:20px;margin-right:10px;"/>  {{lang[local].c2cbizapply}} </Button>
                <div class="tip" v-if="status == 2 || status == 3 || status == 5"> <span class="torg"> {{status == 2 ? lang[local].c2cBeAudited : lang[local].c2cAuditFailed }}</span> <span v-if="status == 3">{{lang[local].c2cReason}}：{{remark}}</span> </div>
            </div>
            <!-- <div class="search" @click="showSearch" v-if="curType != 'myOrder' || status==4"> -->
            <div class="search" @click="showSearch" v-if="curType != 'myOrder' ">
                <div class="box">
                    <template v-if="curType != 'myOrder'">
                        {{!searchList[0] && !searchList[1] && !searchList[2] ? lang[local].all :''}}
                    </template>
                    <template v-if="curType == 'myOrder'">
                        {{!searchList[0] && !searchList[1] && !searchList[2] && !searchList[3] ? lang[local].all:''}}
                    </template>
                    <template v-for="(item,index) in searchList">
                        <span v-if="item">{{item=='bankpay'? lang[local].bankCard : item=='alipay' ? lang[local].aliPay : item=='wxpay' ? lang[local].weChat : item=='buy' ? lang[local].c2cBuy : item=='sell' ? lang[local].c2cSell :item}} <Icon type="close" size="12" class="close" @click="delSearchTxt(index)"/></span>
                    </template>
                </div>
                <Poptip trigger="hover" placement="bottom-end" ref="searchBox" :width=340>
                    <Icon type="ios-search" size="26" class="btn"/>
                    <div class="api" slot="content">
                        <table class="select" >
                            <tbody>
                                <template v-if="curType != 'myOrder'">
                                    <tr>
                                        <td>{{lang[local].c2cCurrency}}：</td>
                                        <td>
                                            <Select v-model="searchTxt1.fCoin" size="large" style="width:150px" :placeholder="lang[local].all" clearable>
                                                <Option v-for="item in currencyList" :value="item.name" :key="item.id">{{ item.name}}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{lang[local].c2cpayType}}：</td>
                                        <td>
                                            <Select v-model="searchTxt1.payType" size="large" style="width:150px" :placeholder="lang[local].all" clearable>
                                                <Option v-for="item in payList" :value="item" :key="item">{{ item=='bankpay'? lang[local].bankCard : item=='alipay' ? lang[local].aliPay : lang[local].weChat }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="curType == 'myOrder'">
                                    <tr>
                                        <td>{{lang[local].c2cDate}}：</td>
                                        <td>
                                            <DatePicker v-model="searchTxt2.date" size="large" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 150px"></DatePicker>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{lang[local].transferType}}：</td>
                                        <td>
                                            <Select v-model="searchTxt2.transferType" size="large" style="width:300px" :placeholder="lang[local].all" clearable>
                                                <Option v-for="item in transferType" :value="item" :key="item">{{ item =='buy' ? lang[local].c2cBuy :lang[local].c2cSell }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{lang[local].c2cCoin}}：</td>
                                        <td>
                                            <Select v-model="searchTxt2.coin" size="large" style="width:300px" :placeholder="lang[local].all" clearable>
                                                <Option v-for="item in coinList" :value="item.toUpperCase()" :key="item">{{ item.toUpperCase() }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{lang[local].c2cCurrency}}：</td>
                                        <td>
                                            <Select v-model="searchTxt2.fCoin" size="large" style="width:300px" :placeholder="lang[local].all" clearable>
                                                <Option v-for="item in currencyList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                </template>
                                <tr>
                                    <td align="center">
                                        <Button size="large" type="text" class="org" @click="allClear">{{lang[local].c2cEmpty}}</Button>
                                    </td>
                                    <td align="center" >
                                        <Button size="large" type="primary" @click.stop="handleSearch">{{lang[local].seek}}</Button> <Button size="large" type="text" @click.stop="closeSearch">{{lang[local].cancel}}</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Poptip>
            </div>
        </div>
        <div v-if="curType == 'myOrder' && status !=4" style="margin:20px 0"><span class="torg">*</span> {{lang[local].c2cApplyTip}}</div>
        <div class="list">
            <dl :class="curType == 'myOrder'?'myOrder':''">
                <dt>
                    <ul v-if="curType != 'myOrder'">
                        <li style="text-align:left;padding-left:15px;">{{lang[local].shop}}</li>
                        <li>{{lang[local].num}}</li>
                        <li>{{lang[local].limit}}</li>
                        <li>{{lang[local].unitPrice}}</li>
                        <li>{{lang[local].c2cpayType}}</li>
                        <li>{{lang[local].operation}}</li>
                    </ul>
                    <ul v-if="curType == 'myOrder'">
                        <li align="left" style="paddingLeft:15px;">{{lang[local].c2cCoin}}</li>
                        <li>{{lang[local].transferType}}</li>
                        <li>{{lang[local].num}}</li>
                        <li>{{lang[local].limit}}</li>
                        <li>{{lang[local].unitPrice}}</li>
                        <li>{{lang[local].c2cpayType}}</li>
                        <li>{{lang[local].transferCoinTime}}</li>
                        <li>{{lang[local].operation}}</li>
                    </ul>
                </dt>
                <dd v-for="(item,index) in pendListArray" v-if=" curType != 'myOrder'">
                    <ul  >
                        <li><span @click=" loginInfo.uid != item.uid ? $router.push(`/biz?id=${item.uid}`) : ''" class="tblue cursor">{{item.business_name}}</span> ({{item.month_orders}})</li>
                        <li>{{item.amount}} {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li class="tbuy">{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <i v-if="item.bankpay" class="iconfont icon-yinxingqia org" />
                            <i v-if="item.wxpay" class="iconfont icon-ai-weixin buy" />
                            <i v-if="item.alipay" class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li><Button :disabled="loginInfo.uid == item.uid ? true : false " size="large" type="primary" :loading="false" @click="operation(index,item.maxvolume,item.minvolume)">{{curType == 'buy' ? `${lang[local].c2cBuy} ${coinList[curCoin].toUpperCase()}` : `${lang[local].c2cSell} ${coinList[curCoin].toUpperCase()}`}}</Button></li>
                        <li v-if="checkMore == index" class="more">
                            <Row>
                                <Col span="6">{{item.business_name}} ({{item.month_orders}})</Col>
                                <Col span="4" class="tbuy">{{item.price}} {{item.currency_name}}</Col>
                                <Col span="10">
                                    <Row>
                                        <Col span="10" class="ka">
                                            <input size="large" :style="errInfo.show ? 'border:1px solid red;':''" v-model="currencyAmount" :placeholder="`${lang[local].c2cIput}...`" @input="changeMoney('currencyAmount',{price:item.price,min:item.minvolume,max:item.maxvolume},$event)"></input><span >{{item.currency_name}}</span>
                                            <div v-if="errInfo.show" class="sell" style="line-height: 20px;">{{errInfo.msg}}</div>
                                        </Col>
                                        <Col span="4" style="line-height: 36px;text-align: center;"><i class="iconfont icon-jiaohuan" style="top:7px;position: relative;"/></Col>
                                        <Col span="10" class="ka"><input size="large" v-model="coinAmount " :placeholder="`${lang[local].c2cIput}...`" @input="changeMoney('coinAmount',{price:item.price,min:item.minvolume,max:item.maxvolume},$event)"></input><span  class="blue cursor" @click="allpay(item.amount,item.price)">{{lang[local].all}}</span></Col>
                                    </Row>
                                </Col>
                                <Col span="4" style="position: relative;top:0px;text-align:right" :style="curType == 'sell' ? 'top:50px':''">
                                    <template v-if="paypassword">
                                        <Button size="large" type="primary" @click="createOrder(item.id)">{{lang[local].c2cbuyOrder}}</Button>
                                        <Button size="large" type="text" @click="cancel">{{lang[local].cancel}}</Button>
                                    </template>
                                    <template v-if="loginGetStatus && loginStatus && !paypassword">
                                        {{lang[local].c2cNoPayPassword}}<Button size="large" type="text" @click="go('set')">{{lang[local].accbtnset}}</Button>                                        
                                    </template>
                                    <template v-if="!loginGetStatus || !loginStatus">
                                        {{lang[local].c2cNoLogin}}<Button size="large" type="text" @click="go('login')" style="padding:10px;margin-top: -3px;font-size:14px;">{{lang[local].login}}</Button>
                                    </template>
                                    
                                </Col>
                                <br />
                                <Col span="6">{{lang[local].num}}：{{item.amount}}</Col>
                                <Col span="4">{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</Col>
                                <Col span="10">
                                    <Row v-if="curType =='sell'">
                                        <Col span="10" style="margin-top:8px;"><Input v-model="emailVerify" size="large" :placeholder="lang[local].emailVerifCode" clearable ><span slot="append" class="blue cursor" @click="sendCode">{{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}</span></Input></Col>
                                        <Col span="10" offset="4"><Input v-model="payPassword" type="password" size="large" :placeholder="lang[local].payPassword" clearable /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row class="n2">
                                <Col span="3" v-if="item.bankpay"><i class="iconfont icon-yinxingqia org" /> {{lang[local].bankCard}}</Col>
                                <Col span="3" v-if="item.wxpay"><i class="iconfont icon-ai-weixin buy" /> {{lang[local].weChat}}</Col>
                                <Col span="3" v-if="item.alipay"><i class="iconfont icon-ZFBZD blue" /> {{lang[local].aliPay}}</Col>
                                <Col span="6" style="textAlign:right;float:right">{{lang[local].c2cPayTime}}<span class="torg">30</span>{{lang[local].c2cminute}}</Col>
                                <Col span="24"></Col>
                                <Col span="24" v-if="item.remark" style="white-space:pre-wrap;line-height:20px"> <span style="color:red">*</span> {{item.remark}}</Col>
                                
                            </Row>
                        </li>                        
                    </ul>
                    
                </dd> 
                <dd v-for="(item,index) in pendListArray" v-if="curType == 'myOrder'">
                    <ul >
                        <li>{{item.symbol.toUpperCase()}}</li>
                        <li :class="item.type == 1 ?'buy':'sell'">{{item.type == 1 ? lang[local].c2cBuy : lang[local].c2cSell}}</li>
                        <li>{{item.amount}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li>{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <i v-if="item.bankpay" class="iconfont icon-yinxingqia org" />
                            <i v-if="item.wxpay" class="iconfont icon-ai-weixin buy" />
                            <i v-if="item.alipay" class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li>{{localDate(item.time)}}</li>
                        <li><Button size="large" type="text" :loading="false" @click="cancelPend(item.id)">{{lang[local].c2cCancel}}</Button></li>
                    </ul>
                </dd>
            
            </dl>
        </div>
        <div class="pageList">
            <page :page="page && page" @pageChange="pageChange" v-if="page.totalPage > 0" />
        </div>
        <Modal
            v-model="addOrderModal"
            :closable = false
            :footer-hide = true
            width="1000"
            class-name="vertical-center-modal">
            
            <addOrder @ok="ok" @close="close" :url="this.api.basicInfo" :params="transferInfoOB"/>
        </Modal>
        <!-- <load v-if="loading" /> -->
        <Modal
            v-model="editBizName"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{lang[local].c2cEditBizName}}</h1>
            <table class="editBizName">
                <tr>
                    <td>{{lang[local].c2cName}}</td>
                    <td align="right"><Input size="large" v-model="business_name" :placeholder="businessInfo.name" /></td>
                </tr>
                <tr>
                    <td colspan="2">
                        {{lang[local].c2cTip2}}
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">
                            <Col span="12"><Button type="primary" size="large" @click="saveName">{{lang[local].c2cSave}}</Button></Col>
                            <Col span="6" offset="6"><Button type="text" size="large" @click="editBizName=false">{{lang[local].c2cClose}}</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
        <Modal
            v-model="applyBizModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal applyBiz" >
            <h1>{{lang[local].c2cTip3}}</h1>
            <p class="tip">{{lang[local].c2cTip4}}</p>
            <table v-if="applyBizInfo">
                <tr class="bline">
                    <td>{{lang[local].realNam}}</td>
                    <td align="right"> <i v-if="applyBizInfo.a == 1" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="applyBizInfo.a == 0 ? gotoUrl('a') : null"> {{applyBizInfo.a == 0 ? lang[local].safety7 : lang[local].c2cQr}}</span></td>
                </tr>
                <tr class="bline">
                    <td>{{lang[local].mobileBind}}</td>
                    <td align="right"> <i v-if="applyBizInfo.b" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('b')"> {{lang[local].safety19}} </span></td>
                </tr>
                <tr class="bline">
                    <td>{{lang[local].payPassword}}</td>
                    <td align="right"> <i v-if="applyBizInfo.c" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('c')"> {{lang[local].safety13}} </span></td>
                </tr>
                <tr class="bline">
                    <td>{{lang[local].transferMode}}</td>
                    <td align="right"> <i v-if="applyBizInfo.d" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('d')"> {{lang[local].safety13}} </span></td>
                </tr>
                <tr>
                    <td>{{lang[local].margin}}</td>
                    <td align="right"> <i v-if="applyBizInfo.e" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('e')"> {{lang[local].c2cTransfer}} </span></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <p>{{lang[local].c2cTip5}} <span class="org">{{applyBizInfo.c2c_deposit_amount}} {{applyBizInfo.c2c_deposit_coin}} </span></p>
                        <p>{{lang[local].c2cTip6}}</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">
                            <Col span="24" v-if="applyBizInfo.a && applyBizInfo.a !=2 && applyBizInfo.b && applyBizInfo.c && applyBizInfo.d && applyBizInfo.e"><Button type="primary" size="large" @click=" $router.push('/apply')">{{lang[local].c2cGoApply}}</Button></Col>
                            <Col span="24" v-if="!applyBizInfo.a || applyBizInfo.a ==2 || !applyBizInfo.b || !applyBizInfo.c || !applyBizInfo.d || !applyBizInfo.e"><Button type="primary" size="large" @click="applyBizModal=false">{{lang[local].c2cClose}}</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
        <Modal
            v-model="canOrderModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal applyBiz" >
            <h1>{{lang[local].c2cTip33}}</h1>
            <p class="tip">{{lang[local].c2cTip44}}</p>
            <table v-if="applyBizInfo">
                <tr class="bline">
                    <td>{{lang[local].realNam}}</td>
                    <td align="right"> <i v-if="applyBizInfo.a == 1" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="applyBizInfo.a == 0 ? gotoUrl('a') : null"> {{applyBizInfo.a == 0 ? lang[local].safety7 : lang[local].c2cQr}}</span></td>
                </tr>
                <tr class="bline">
                    <td>{{lang[local].mobileBind}}</td>
                    <td align="right"> <i v-if="applyBizInfo.b" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('b')"> {{lang[local].safety19}} </span></td>
                </tr>
                <tr class="bline">
                    <td>{{lang[local].payPassword}}</td>
                    <td align="right"> <i v-if="applyBizInfo.c" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('c')"> {{lang[local].safety13}} </span></td>
                </tr>
                <tr class="bline">
                    <td style="text-align:left">{{lang[local].transferMode}}</td>
                    <td align="right"> <i v-if="applyBizInfo.d" class="iconfont icon-duihao_ buy" /> <span v-else class="blue cursor" @click="gotoUrl('d')"> {{lang[local].safety13}} </span></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">                            
                            <Col span="24"><Button type="primary" size="large" @click="canOrderModal=false">{{lang[local].c2cClose}}</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
    </section>
</div>
</template>

<script>
    import {mapState} from "vuex"
    import dayjs from 'dayjs'
    import {toUrl} from "../../../common/api/api"
    const dayformat = 'YYYY/MM/DD'
    export default {
        name: "list",
        data (){
            return {
                loading:true,
                page : {
                    currPage : 0,
                    totalPage : 0,
                    pageSize : 10,
                    totalCount : 10,
                },
                curType:'buy',
                curCoin:0,
                coinList:[],
                checkMore:null,
                searchTxt1:{
                    fCoin:null,
                    payType:null,
                },
                searchTxt2:{
                    date:['',''],
                    transferType:null,
                    coin:null,
                    fCoin:null,
                },
                payList:['bankpay','alipay','wxpay'],
                transferType:['buy','sell'],
                model4:'',
                addOrderModal:false,
                applyBizModal:false,
                editBizName:false,
                canOrderModal:false,
                business_name:'',
                status:0,
                remark:'',
                buyList:[],
                sellList:[],
                myList:[],
                currencyList:[],
                pendListArray:[],
                businessInfo:{},
                paypassword:false,
                coinAmount:null,
                currencyAmount:null,
                orderCoinAmount:null,
                orderCurrencyAmount:null,
                money:null,
                transferInfoOB:{},
                sendCodeStatus:false,
                sendCodeCount:0,
                emailVerify:'',
                payPassword:'',
                max:0,
                min:0,
                errInfo:{
                    show:false,
                    msg:''
                },
                applyBizInfo:{},
                canbuy:false,
            };
        },
        created (){
            // this.basicInfo()
            this.userInfo()
        },
        mounted(){
            console.log(this.loginInfo.uid);
            if(this.$route.query.myorder){
                console.log(this.$route.query.myorder,this.status)                
                this.curType = 'myOrder'
                this.personalDetail()
                this.personalPendList()
            }
            this.axios({
                url : this.api.basicInfo,
                data : {

                }
            }).then(res=>{
                this.coinList = res.data.coin_list
                this.currencyList = res.data.currency_list
                this.pendList()
            }).catch( err=>{
                console.log(err)
            })
        },
        watch:{
            'currencyAmount' (n,o){
                let numlength = 2
                let v = ''
                for(let k=0;k<numlength;k++){
                    v += '\\d'
                }
                let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
                this.currencyAmount = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
                
                // this.coinAmount = this.currencyAmount / this.price
            },
            'coinAmount' (n,o){
                let numlength = 8
                let v = ''
                for(let k=0;k<numlength;k++){
                    v += '\\d'
                }
                let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
                this.coinAmount = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
                // this.coinAmount = this.currencyAmount * this.price
            },
            // delcur(n,o){
            //     this.list.normal_list.splice(n,1)
            //     this.list.finish_list.unshift(this.list.normal_list[n])
            //     this.getList()
            //     location.reload()
            // }            
        },
        computed : {
            // ...mapState(['activeObject'])
            // coinAmount(){
            //     return 
            // },

            searchList(){
                let date
                if(this.searchTxt2.date){
                    if(this.searchTxt2.date[0] == ''){
                        date == null
                    }else{
                        date = `${dayjs(this.searchTxt2.date[0]).format(dayformat)}~${dayjs(this.searchTxt2.date[1]).format(dayformat)}`
                    }
                }else{
                    date = null
                }
                let val2 = [date, this.searchTxt2.transferType , this.searchTxt2.coin , this.searchTxt2.fCoin],
                    val = [ this.searchTxt1.fCoin , this.searchTxt1.payType]
                return  this.curType == 'myOrder' ? val2 : val
            },
            ...mapState('login',['loginInfo','loginStatus','loginGetStatus'])
        },
        methods : {
            pageChange (page){
                this.page = page
                if(this.curType=='buy' || this.curType=='sell'){                    
                    this.pendList()
                }else{
                    this.personalPendList()
                }
            },
            handleClass(val){
                this.curType = val
                if(val == "myOrder"){
                    this.personalPendList()
                    this.personalDetail()
                    this.page = {
                        currPage : 0,
                        totalPage : 0,
                        pageSize : 10,
                        totalCount : 10,
                    }
                }else{
                    this.pendList(this.page)
                    this.page = {
                        currPage : 0,
                        totalPage : 0,
                        pageSize : 10,
                        totalCount : 10,
                    }
                }
                this.checkMore = null
            },
            changeCoin(index){
                this.curCoin = index
                this.pendList(this.page)
                this.checkMore = null
            },
            delSearchTxt(index){
                if(this.curType == 'myOrder'){
                    this.searchTxt2[Object.keys(this.searchTxt2)[index]] = null
                }else{
                    this.searchTxt1[Object.keys(this.searchTxt1)[index]] = null
                }
            },
            showSearch(){
               this.$refs.searchBox.handleMouseenter()
            },
            handleSearch(){
                
                if(this.curType=='buy' || this.curType=='sell'){                    
                    this.pendList()
                }else{                    
                    this.personalPendList(this.page)
                }
                this.$refs.searchBox.handleMouseleave()
            },
            closeSearch(){
                this.$refs.searchBox.handleMouseleave() 
            },
            getList(info,id){

            },
            operation(index,max,min){
                if(this.canbuy){
                    this.coinAmount=null
                    this.currencyAmount = null
                    this.checkMore = index
                    this.max = max
                    this.min = min
                    return
                }
                let a,b,c,d
                this.axios({
                    url : this.api.applyRequirements,
                    data : {
                    }
                }).then((res) => {
                    a =  res.data.is_certificate
                    b =  res.data.is_bind_mobile
                    c =  res.data.is_set_pay_password
                    d =  res.data.is_set_transfer
                    this.applyBizInfo = {
                       a,b,c,d,
                       
                   }
                   if(a!=1 || b!=1 || c!=1 || d!=1){                       
                        this.canOrderModal = true
                        return
                    }else{
                        this.coinAmount=null
                        this.currencyAmount = null
                        this.checkMore = index
                        this.max = max
                        this.min = min
                        this.canbuy = true
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$store.commit('msg/err', err.message)
                })                
            },
            cancel(){
                this.checkMore = null
                this.coinAmount=null
                this.currencyAmount = null
            },
            ok(val){
                let bank_pay = 0, wx_pay = 0, ali_pay = 0
                console.log(val);
                
                val.payment.map(d=>{
                    switch (d) {
                        case '1':
                            bank_pay = 1
                            break;
                        case '2':
                            ali_pay = 1
                            break;
                        case '3':
                            wx_pay = 1
                            break;
                    
                        default:
                            break;
                    }
                })
                let playload = {
                    coin: val.coin,
                    amount: val.count,
                    price: val.price,
                    type: val.type,
                    currency: val.currency,
                    bank_pay,
                    wx_pay,
                    ali_pay,
                    min: val.min,
                    max: val.max,
                    remark: val.note,
                }         
                this.axios({
                    url : this.api.createPend,
                    data : {
                        ...playload
                    }
                }).then(res => {
                    this.personalPendList(this.page)
                    this.addOrderModal = false
                    this.$store.commit('msg/add', res.message)
                }).catch(err=>{
                    this.$store.commit('msg/err', err.message)
                })
            },
            close(){
                this.addOrderModal = false
            },
            addOrder(){
                this.addOrderModal = true
                this.transferInfo()
            },
            allClear(){
                if(this.curType == 'myOrder'){
                    this.searchTxt2.fCoin = null
                    this.searchTxt2.transferType = null
                    this.searchTxt2.coin = null
                    this.searchTxt2.date = null
                }else{
                    this.searchTxt1.fCoin = null
                    this.searchTxt1.payType = null
                }
                
            },
            saveName(){
                if(!this.business_name.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].c2cErr1)
                    return
                } 
                this.axios({
                    url : this.api.updateName,
                    data : {
                        business_name:this.business_name.trim()
                    }
                }).then(res=>{
                    this.personalDetail()
                    this.$store.commit('msg/add', res.message)
                    this.editBizName=false
                })           
            },
            basicInfo(){
                this.axios({
                    url : this.api.basicInfo,
                    data : {

                    }
                }).then(res=>{
                    this.coinList = res.data.coin_list
                    this.currencyList = res.data.currency_list
                }).catch( err=>{
                    // this.$store.commit('msg/err', err.message)
                    console.log(err.message);
                })
            },
            userInfo(){
                this.axios({
                    url : this.api.userInfo,
                    data : {

                    }
                }).then(res=>{
                    this.paypassword = res.data.paypassword
                }).catch( err=>{
                    // this.$store.commit('msg/err', err.message)
                    console.log(err.message);
                    
                })
            },
            personalDetail(){
                this.axios({
                    url : this.api.personalDetail,
                    data : {
                    }
                }).then(res=>{
                    this.status = res.data.status
                    this.remark = res.data.remark
                    if(res.data.status == 4){
                        this.businessInfo = res.data.business_info
                    }                    
                }).catch( err=>{
                    this.$store.commit('msg/err', err.message)
                })
            },
            personalPendList(searchInfo){
                console.log(this.searchTxt2);                
                searchInfo = {
                    type:this.searchTxt2.transferType =='buy' ? 1 : this.searchTxt2.transferType =='sell' ? 2 : 0,
                    coin:this.searchTxt2.coin,
                    currency:this.searchTxt2.fCoin,
                    from_date: this.searchTxt2.date[0] && dayjs(this.searchTxt2.date[0]).format('YYYY-MM-DD'),
                    to_date: this.searchTxt2.date[1] && dayjs(this.searchTxt2.date[1]).format('YYYY-MM-DD'),
                }
                this.axios({
                    url : this.api.personalPendList,
                    data : {
                        ...searchInfo,
                        ...this.page
                    }
                }).then(res=>{
                    this.pendListArray = res.data.list
                    this.page = res.data.page                    
                }).catch( err=>{
                    this.$store.commit('msg/err', err.message)
                })
            },            
            pendList(searchInfo){
                let type
                switch (this.curType) {
                    case 'buy':
                        type = 2
                        break;
                    case 'sell':
                        type = 1
                        break;
                    default:
                        break;
                }
                if(!searchInfo){
                    searchInfo = {
                        currency:this.searchTxt1.fCoin,
                        pay_type:this.searchTxt1.payType,
                    }
                }
                this.axios({
                    url : this.api.pendList,
                    data : {
                        type,
                        coin:this.coinList[this.curCoin],
                        ...searchInfo,
                        ...this.page
                    }
                }).then(res=>{
                    let data = res.data
                    this.pendListArray = data.list
                    this.page = data.page
                }).catch( err=>{
                    this.$store.commit('msg/err', err.message)
                })
            },
            cancelPend(id){
                this.axios({
                    url : this.api.cancelPend,
                    data : {
                        pend_id:id,
                    }
                }).then(res=>{
                    this.personalPendList()
                    this.$store.commit('msg/add', res.message)
                }).catch( err=>{
                    this.$store.commit('msg/err', err.message)
                })
            },
            createOrder(id){                
                if(!this.currencyAmount){
                    this.$store.commit('msg/err', this.lang[this.local].c2cErr2)
                    return
                }
                if(this.currencyAmount*1 > this.max*1){
                    this.$store.commit('msg/err', this.lang[this.local].c2cErr3)
                    return
                }
                if(this.currencyAmount*1 < this.min*1){
                    this.$store.commit('msg/err', this.lang[this.local].c2cErr4)
                    return
                }
                if(this.curType == 'sell'){
                    if(!this.emailVerify){
                        this.$store.commit('msg/err', this.lang[this.local].c2cErr5)
                        return
                    }
                    if(!this.payPassword){
                        this.$store.commit('msg/err', this.lang[this.local].c2cErr6)
                        return
                    }
                }
                this.axios({
                    url : this.api.createOrder,
                    data : {
                        pend_id:id,
                        money:parseFloat((this.currencyAmount*1).toFixed(2)),
                        email_verify:this.emailVerify,
                        pay_password:this.payPassword
                    }
                }).then(res=>{
                    location.href = toUrl.financeUrl + '/c2cDetail?id=' + res.data.order_id
                    // this.pendList()
                    // this.checkMore = null
                    // this.coinAmount = null
                    // this.currencyAmount = null
                    // this.$store.commit('msg/add', res.message)
                }).catch( err=>{
                    // this.coinAmount = null
                    // this.currencyAmount = null
                    this.pendList()
                    this.$store.commit('msg/err', err.message)
                })
            },
            changeMoney(v,val,event){                
                if(v == 'currencyAmount'){
                    this.coinAmount = parseFloat((event.target.value / val.price).toFixed(8))
                    if(this.currencyAmount && this.currencyAmount*1 > val.max*1){
                        this.errInfo.msg = `${this.lang[this.local].c2cErr7}${val.max}`
                        this.errInfo.show = true
                        console.log(val.min,val.max,);
                        
                    }else if(this.currencyAmount && this.currencyAmount*1 < val.min*1){
                        this.errInfo.msg = `${this.lang[this.local].c2cErr8}${val.min}`
                        this.errInfo.show = true
                    }else{
                        this.errInfo.show = false                        
                    }
                }else{                   
                    this.currencyAmount = parseFloat((event.target.value * val.price).toFixed(2))
                    if(this.currencyAmount && this.currencyAmount*1 > val.max*1){
                        this.errInfo.msg = `${this.lang[this.local].c2cErr7}${val.max}`
                        this.errInfo.show = true
                    }else if(this.currencyAmount && this.currencyAmount*1 < val.min*1){
                        this.errInfo.msg = `${this.lang[this.local].c2cErr8}${val.min}`
                        this.errInfo.show = true
                    }else{
                        this.errInfo.show = false
                    }
                }
                
            },
            allpay(v,price){
                this.coinAmount = v
                this.currencyAmount = v * price
            },
            transferInfo(){
                this.axios({
                    url : this.api.transferInfo,
                    data : {

                    }
                }).then(res=>{
                    this.transferInfoOB= res.data
                }).catch( err=>{
                    this.$store.commit('msg/err', err.message)
                })
            },
            go(val){
                if(val == 'set'){
                    location.href = toUrl.financeUrl + '/setTradePassword' 
                }else{
                    location.href = toUrl.loginUrl
                }
            },
            applyBiz(){
                this.applyBizModal = true
                this.axios({
                    url : this.api.applyRequirements,
                    data : {
                    }
                }).then((res) => {
                   const a =  res.data.is_certificate
                   const b =  res.data.is_bind_mobile
                   const c =  res.data.is_set_pay_password
                   const d =  res.data.is_set_transfer
                   const e =  res.data.is_deposit
                   this.applyBizInfo = {
                       a,b,c,d,e,
                       c2c_deposit_amount:res.data.c2c_deposit_amount,
                       c2c_deposit_coin:res.data.c2c_deposit_coin,
                   }
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                });
                //this.$router.push('/apply')
            },

            sendCode (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.sendCaptcha,
                    data : {
                        type:9
                    }
                }).then((res) => {
                    this.sendCodeStatus = true;
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message);
                    this.verifyCodeTimeText = '';
                    this.sendCodeStatus = false;
                });
                return true;
            },
            gotoUrl(v){
                switch (v) {
                    case 'a':
                        location.href = process.env.NODE_ENV == 'development' ? '/finance.html/nameAuth' : '/home/finance/nameAuth'
                        break;
                    case 'b':
                        location.href = process.env.NODE_ENV == 'development' ? '/finance.html/mobileBind' : '/home/finance/mobileBind'
                        break;
                    case 'c':
                        location.href = process.env.NODE_ENV == 'development' ? '/finance.html/setTradePassword' : '/home/finance/setTradePassword'
                        break;
                    case 'd':
                        location.href = process.env.NODE_ENV == 'development' ? '/finance.html/transferMode' : '/home/finance/transferMode'
                        break;
                    case 'e':
                        location.href = process.env.NODE_ENV == 'development' ? '/finance.html/index' : '/home/finance/index'
                        break;
                
                    default:
                        break;
                }
            }

        }
    }
</script>

<style scoped lang="scss" >
    .list{
        overflow: hidden;
        margin-bottom: 30px;
        li{
            float: left;white-space:nowrap;
            .iconfont{font-size:22px;margin-right:5px;}
            &:nth-child(1){width:20%}
            &:nth-child(2){width:20%}
            &:nth-child(3){width:15%}
            &:nth-child(4){width:15%}
            &:nth-child(5){width:15%}
            &:nth-child(6){width:14%}
            &.more{
                width: 100%;
                background: #F8F8F8;
                border:1px solid #FBE7DC;
                margin-top:-53px;
                padding:10px 30px;
                text-align:left;
                position: relative;
                z-index:999;
                .n2{
                    border-top:1px dashed #ddd;
                    .iconfont{font-size:26px;position: relative;top:5px;margin-right:5px;}
                }
            }
        }
        dl{
            &.myOrder{
                ul{overflow: hidden;}
                li{
                    &:nth-child(1){width:10%}
                    &:nth-child(2){width:10%}
                    &:nth-child(3){width:15%}
                    &:nth-child(4){width:15%}
                    &:nth-child(5){width:10%}
                    &:nth-child(6){width:10%}
                    &:nth-child(7){width:20%}
                    &:nth-child(8){width:10%}
                }
           }
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
    .editBizName{
        margin:30px auto;
        tr{
           td{
                line-height: 30px;font-size: 14px;padding:10px 0;
            } 
        }
        
    }
    .cursor{
        cursor: pointer;
    }
    .pageList{
        width: 100%;
        padding:30px auto;
    }
    .ka{
        input{
            border-radius:4px 0 0 4px;
            border:1px solid #dddee1;
            line-height:36px;
            padding:0 10px;
            transition:all .3s;
            width:80%;
            &:focus, &:hover{
                border:1px solid #FF6600;
            }
        }
        span{
            border-radius:0 4px 4px 0;
            border:1px solid #dddee1;
            border-left: none;
            line-height:36px;
            display: inline-block;
            padding:0 10px;
            background: #eee;
        }
    }
    .applyBiz{
        color:#999;
        .tip{
            font-size:16px;
            margin:30px 0;
        }
        table{
            font-size:15px;
            width: 100%;
            .bline{
                border-bottom: 1px dotted #ccc
            }
            tr:last-child{text-align: center;}  
            td{
                line-height: 50px;
                p{line-height: 26px;}
            }
        }
        .iconfont{font-size:22px;line-height: 26px;}
    }
</style>
