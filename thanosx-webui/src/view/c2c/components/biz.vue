<template>
<div class="c2c">
    <section class="c2cindex container">
        <div class="seller">
            <Row>
                <Col span="12" class="lt">
                    <h2>{{bizInfo.name}}</h2>
                    <div>{{lang[local].registerTime}}：{{localDate(bizInfo.checked_time)}}</div>
                </Col>
                <Col span="12" class="rt">
                    <ul>
                        <li><span>{{bizInfo.deposit}}</span><br/>{{lang[local].bizDeposit}}</li>
                        <li><span>{{bizInfo.month_orders}}</span><br/>{{lang[local].monthOrders}}</li>
                        <li><span>{{bizInfo.total_orders}}</span><br/>{{lang[local].totalOrders}}</li>
                        <li><span>{{bizInfo.order_rate}}</span><br/>{{lang[local].orderRate}}</li>
                    </ul>
                </Col>
            </Row>
        </div>

        <div class="list">
            <h3>{{lang[local].onlineBuy}}</h3>
            <dl>
                <dt>
                    <ul > 
                        <li align="left" style="paddingLeft:15px;">{{lang[local].c2cCoin}}</li>
                        <li>{{lang[local].num}}</li>
                        <li>{{lang[local].limit}}</li>
                        <li>{{lang[local].unitPrice}}</li>
                        <li>{{lang[local].c2cpayType}}</li>
                        <li>{{lang[local].operation}}</li>
                    </ul>
                </dt>
                <dd v-if="loading" style="height:100px"><load/></dd>
                <dd v-if="!loading && buyList.length == 0" style="text-algin:center;width:100%">{{lang[local].emptyData}}</dd>
                <dd v-for="(item,index) in buyList">
                    <ul>
                        <li> {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.amount}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li class="tbuy">{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <template v-for="val in item.pays">
                                <i v-if="val.type =='1'" class="iconfont icon-yinxingqia org" />
                                <i v-if="val.type =='3'"  class="iconfont icon-ai-weixin buy" />
                                <i v-if="val.type =='2'"  class="iconfont icon-ZFBZD blue" />
                                <i v-if="val.type =='4'"  class="iconfont icon-paynow org" />
                                <i v-if="val.type =='5'"  class="iconfont icon-race org" />
                                <i v-if="val.type =='6'"  class="iconfont icon-paypal blue" />
                                <i v-if="val.type =='7'"  class="iconfont icon-uip org" />
                            </template>
                        </li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(item.id,item.maxvolume,item.minvolume,item.currency_name)">{{`${lang[local].c2cSell} ${item.symbol.toUpperCase()}`}}</Button></li>
                        <li v-if="checkMore == item.id" class="more">
                            <Row>
                                <Col span="6">{{item.symbol.toUpperCase()}}</Col>
                                <Col span="4" class="tbuy">{{item.price}} {{item.currency_name}}</Col>
                                <Col span="10">
                                    <Row>
                                        <Col span="10" class="ka">
                                            <input size="large" :style="errInfo.show ? 'border:1px solid red;':''" v-model="currencyAmount" :placeholder="`${lang[local].c2cIput}...`" @input="changeMoney('currencyAmount',{price:item.price,min:item.minvolume,max:item.maxvolume},$event)"></input><span >{{item.currency_name}}</span>
                                            <div v-if="errInfo.show" class="sell" style="line-height: 20px;">{{errInfo.msg}}</div>
                                        </Col>                                        
                                        <Col span="4" style="line-height: 36px;text-align: center;"><i class="iconfont icon-jiaohuan" style="top:7px;position: relative;"/></Col>
                                        <Col span="10" class="ka"><input size="large" v-model="coinAmount " :placeholder="`${lang[local].c2cIput}...`" @input="changeMoney('coinAmount',item.price,$event)"></input><span  class="blue cursor" @click="allpay(item.amount,item.price)">{{lang[local].all}}</span></Col>
                                    </Row>
                                </Col>
                                <Col span="4" style="position: relative;top:50px;text-align:right">
                                    <template v-if="paypassword">
                                        <Button size="large" type="primary" @click="createOrder(item.id,1)">{{lang[local].c2cbuyOrder}}</Button>
                                        <Button size="large" type="text" @click="cancel">{{lang[local].cancel}}</Button>
                                    </template>
                                    <template v-if="!paypassword">
                                        {{lang[local].c2cNoPayPassword}}<Button size="large" type="text">{{lang[local].accbtnset}}</Button>                                        
                                    </template>
                                    <template v-if="!loginGetStatus || !loginStatus">
                                        {{lang[local].c2cNoLogin}}<Button size="large" type="text" @click="go('login')" style="padding:10px;margin-top: -3px;font-size:14px;">{{lang[local].login}}</Button>
                                    </template>
                                </Col>
                                <br />
                                <Col span="6">{{lang[local].num}}：{{item.amount}}</Col>
                                <Col span="4">{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</Col>
                                <Col span="10">
                                    <Row>
                                        <Col span="10" style="margin-top:8px;"><Input v-model="emailVerify" size="large" :placeholder="lang[local].emailVerifCode" clearable ><span slot="append" class="blue cursor" @click="sendCode">{{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}</span></Input></Col>
                                        <Col span="10" offset="4"><Input v-model="payPassword" type="password" size="large" :placeholder="lang[local].payPassword" clearable /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row class="n2">
                                <template v-for="val in item.pays">
                                    <Col span="3" v-if="val.type =='1'"><i class="iconfont icon-yinxingqia org" /> {{lang[local].bankCard}}</Col>
                                    <Col span="3" v-if="val.type =='3'"><i class="iconfont icon-ai-weixin buy" /> {{lang[local].weChat}}</Col>
                                    <Col span="3" v-if="val.type =='2'"><i class="iconfont icon-ZFBZD blue" /> {{lang[local].aliPay}}</Col>
                                    <Col span="3" v-if="val.type =='4'"><i class="iconfont icon-paynow  org" /> PayNow</Col>
                                    <Col span="3" v-if="val.type =='5'"><i class="iconfont icon-race org" /> Interace</Col>
                                    <Col span="3" v-if="val.type =='6'"><i class="iconfont icon-paypal blue" /> Paypal</Col>
                                    <Col span="3" v-if="val.type =='7'"><i class="iconfont icon-uip org" /> UIP</Col>
                                </template>
                                <Col span="6" style="textAlign:right;float:right" >{{lang[local].c2cPayTime}} <span class="torg">30</span> {{lang[local].minute}}</Col>
                                <Col span="24"></Col>
                                <Col span="24" v-if="item.remark" style="white-space:pre-wrap;line-height:20px"><span style="color:red">*</span>{{item.remark}}</Col>
                                
                            </Row>
                        </li>                        
                    </ul>
                </dd>
            </dl>
        </div>

        <div class="list">
            <h3>{{lang[local].onlineSell}}</h3>
            <dl>
                <dt>
                    <ul >
                        <li align="left" style="paddingLeft:15px;" >{{lang[local].c2cCoin}}</li>
                        <li>{{lang[local].num}}</li>
                        <li>{{lang[local].limit}}</li>
                        <li>{{lang[local].unitPrice}}</li>
                        <li>{{lang[local].c2cpayType}}</li>
                        <li>{{lang[local].operation}}</li>
                    </ul>
                </dt>
                <dd v-if="loading" style="height:100px"><load/></dd>
                <dd v-if="!loading && sellList.length == 0" style="text-algin:center;width:100%">{{lang[local].emptyData}}</dd>
                <dd v-for="(item,index) in sellList">
                    <ul>
                        <li> {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.amount}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li class="tbuy">{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <template v-for="val in item.pays">
                                <i v-if="val.type =='1'" class="iconfont icon-yinxingqia org" />
                                <i v-if="val.type =='3'"  class="iconfont icon-ai-weixin buy" />
                                <i v-if="val.type =='2'"  class="iconfont icon-ZFBZD blue" />
                                <i v-if="val.type =='4'"  class="iconfont icon-paynow org" />
                                <i v-if="val.type =='5'"  class="iconfont icon-race org" />
                                <i v-if="val.type =='6'"  class="iconfont icon-paypal blue" />
                                <i v-if="val.type =='7'"  class="iconfont icon-uip org" />
                            </template>
                        </li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(item.id,item.maxvolume,item.minvolume,item.currency_name)">{{`${lang[local].c2cBuy} ${item.symbol.toUpperCase()}`}}</Button></li>
                        <li v-if="checkMore == item.id" class="more">                            
                            <Row>
                                <Col span="6">{{item.symbol.toUpperCase()}}</Col>
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
                                <Col span="4" style="position: relative;top:0px;text-align:right">
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
                                <!-- <Col span="12">
                                    <Row>
                                        <Col span="8" style="margin-top:8px;"><Input size="large" placeholder="邮件验证码" clearable ><span slot="append" class="blue cursor">获取验证码</span></Input></Col>
                                        <Col span="8" offset="2"><Input size="large" placeholder="交易密码" clearable /></Col>
                                    </Row>
                                </Col> -->
                            </Row>
                            <Row class="n2">
                                <template v-for="val in item.pays">
                                    <Col span="3" v-if="val.type =='1'"><i class="iconfont icon-yinxingqia org" /> {{lang[local].bankCard}}</Col>
                                    <Col span="3" v-if="val.type =='3'"><i class="iconfont icon-ai-weixin buy" /> {{lang[local].weChat}}</Col>
                                    <Col span="3" v-if="val.type =='2'"><i class="iconfont icon-ZFBZD blue" /> {{lang[local].aliPay}}</Col>
                                    <Col span="3" v-if="val.type =='4'"><i class="iconfont icon-paynow  org" /> PayNow</Col>
                                    <Col span="3" v-if="val.type =='5'"><i class="iconfont icon-race org" /> Interace</Col>
                                    <Col span="3" v-if="val.type =='6'"><i class="iconfont icon-paypal blue" /> Paypal</Col>
                                    <Col span="3" v-if="val.type =='7'"><i class="iconfont icon-uip org" /> UIP</Col>
                                </template>
                                <Col span="6" style="textAlign:right;float:right">{{lang[local].c2cPayTime}} <span class="torg">30</span> {{lang[local].minute}}</Col>
                                <Col span="24"></Col>
                                <Col span="24" v-if="item.remark" style="white-space:pre-wrap;line-height:20px"> <span style="color:red">*</span> {{item.remark}}</Col>
                                
                            </Row>
                        </li>                        
                    </ul>
                </dd>           
            </dl>
        </div>
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
        <!-- <load v-if="loading" /> -->
    </section>
</div>
</template>

<script>
    import {mapState} from "vuex"
    import dayjs from 'dayjs'
    const dayformat = 'YYYY/MM/DD'
    export default {
        name: "list",
        data (){
            return {
                loading:true,
                curType:'buy',
                curCoin:0,
                coinList:['BTC','ETH','USDT'],
                checkMore:null,
                addOrderModal:false,
                editBizName:false,
                canOrderModal:false,
                business_name:'',
                buyList:{},
                sellList:{},
                bizInfo:{},
                paypassword:false,
                coinAmount:null,
                currencyAmount:null,
                money:null,
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
                currencyUse:[],
                canbuycoin:false,
                loading:true,
            };
        },
        created (){
            this.detail()
        },
        mounted(){
            this.userInfo()
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
        },
        computed : {
            // ...mapState(['activeObject'])

        },
        methods : {
            handleClass(val){
                this.curType = val
                this.checkMore = ''
            },
            changeCoin(index){
                this.curCoin = index
                this.checkMore = ''
            },

            showSearch(){
               this.$refs.searchBox.handleMouseenter()
            },
            getList(info,id){

            },
            operation(index,max,min,currency){
                if(this.currencyUse.length > 0){
                    let same = this.currencyUse.indexOf(currency)
                    if(same < 0){
                        this.$store.commit('msg/err',this.lang[this.local].diffCurrency)
                        return
                    }else{
                        this.canbuycoin = true
                    }
                }
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
                    this.currencyUse =  res.data.currency_list
                    this.applyBizInfo = {
                       a,b,c,d
                   }
                   if(a!=1 || b!=1 || c!=1 || d!=1){                       
                        this.canOrderModal = true
                        return
                    }else if(this.currencyUse.indexOf(currency)<0){
                        console.log(this.currencyUse)                        
                        this.$store.commit('msg/err',this.lang[this.local].diffCurrency)
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
                    this.$store.commit('msg/err', err.message)
                }) 
            },
            cancel(){
                this.checkMore = null
                this.coinAmount=null
                this.currencyAmount = null
            },
            ok(){
                this.addOrderModal = false
            },
            close(){
                this.addOrderModal = false
            },
            addOrder(){
                this.addOrderModal = true
            },
            userInfo(){
                this.axios({
                    url : this.api.userInfo,
                    data : {

                    }
                }).then(res=>{
                    console.log(res);
                    this.paypassword = res.data.paypassword
                }).catch( err=>{
                    console.log(err);
                })
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
                    this.$store.commit('msg/add', res.message)
                    this.editBizName=false
                })           
            },
            detail(){
                this.loading = true
                this.axios({
                    url : this.api.detail,
                    data : {
                        user_id:this.$route.query.id
                    }
                }).then(res=>{
                    this.loading = false
                    this.bizInfo = res.data.business_info
                    this.buyList = res.data.buy_list
                    this.sellList = res.data.sell_list
                }) 
            },



            createOrder(id,type){
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
                       a,b,c,d
                   }
                   if(a!=1 || b!=1 || c!=1 || d!=1){
                       
                       this.canOrderModal = true
                        return
                    }
                    console.log(a,b,c,d);
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message)
                })

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
                if(type){
                    if(!this.emailVerify){
                        this.$store.commit('msg/err', this.lang[this.local].c2cErr9)
                        return
                    }
                    if(!this.payPassword){
                        this.$store.commit('msg/err', this.lang[this.local].c2cErr10)
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
                    location.href = process.env.NODE_ENV == 'development' ? '/finance.html/c2cDetail?id=' + res.data.order_id : '/home/finance/c2cDetail?id=' + res.data.order_id
                    // this.detail()
                    // this.checkMore = null
                    // this.coinAmount = null
                    // this.currencyAmount = null
                    // this.$store.commit('msg/add', res.message)
                }).catch( err=>{
                    this.coinAmount = null
                    this.currencyAmount = null                    
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
            go(val){
                if(val == 'set'){
                    location.href = toUrl.financeUrl + '/setTradePassword' 
                }else{
                    location.href = toUrl.loginUrl
                }
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
                        location.href = process.env.NODE_ENV == 'development' ? '/trade.html/eth/usdt' : '/home/trade/c2cOrder/eth/usdt'
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
        border-bottom:2px solid #F8F8F8;
        margin-bottom:60px;
        h3{
            border-left:3px solid #FF6600;
            padding-left:15px;
            margin-bottom:20px;
        }
        li{
            float: left;white-space:nowrap;
            .iconfont{font-size:22px;margin-right:5px;}
            &:nth-child(1){width:10%}
            &:nth-child(2){width:15%}
            &:nth-child(3){width:20%}
            &:nth-child(4){width:15%}
            &:nth-child(5){width:25%}
            &:nth-child(6){width:14%}
            &.more{
                width: 100%;
                background: #F8F8F8;
                border:1px solid #FBE7DC;
                margin-top:-50px;
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
    .editBizName{
        margin:30px auto;
        tr{
           td{
                line-height: 30px;font-size: 14px;padding:10px 0;
            } 
        }
        
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
