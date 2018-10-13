<template>
<div class="c2c">
    <section class="c2cindex container">
        <div class="seller">
            <Row>
                <Col span="12" class="lt">
                    <h2>{{bizInfo.name}}</h2>
                    <div>入驻时间：{{localDate(bizInfo.checked_time)}}</div>
                </Col>
                <Col span="12" class="rt">
                    <ul>
                        <li><span>{{bizInfo.deposit}}</span><br/>商家保证金</li>
                        <li><span>{{bizInfo.month_orders}}</span><br/>近30天成单</li>
                        <li><span>{{bizInfo.total_orders}}</span><br/>总成单</li>
                        <li><span>{{bizInfo.order_rate}}</span><br/>总成单率</li>
                    </ul>
                </Col>
            </Row>
        </div>

        <div class="list">
            <h3>在线购买</h3>
            <dl>
                <dt>
                    <ul > 
                        <li>币种</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>操作</li>
                    </ul>
                </dt>
                <dd v-for="(item,index) in buyList">
                    <ul>
                        <li> {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.amount}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li class="tbuy">{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <i v-if="item.bankpay" class="iconfont icon-yinxingqia org" />
                            <i v-if="item.wxpay" class="iconfont icon-ai-weixin buy" />
                            <i v-if="item.alipay" class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(item.id,item.maxvolume,item.minvolume)">{{`售出 ${item.symbol.toUpperCase()}`}}</Button></li>
                        <li v-if="checkMore == item.id" class="more">
                            <Row>
                                <Col span="4">{{item.symbol.toUpperCase()}}</Col>
                                <Col span="4" class="tbuy">{{item.price}} {{item.currency_name}}</Col>
                                <Col span="12">
                                    <Row>
                                        <Col span="8"><Input size="large" v-model="currencyAmount" placeholder="请输入..." @input="changeMoney('currencyAmount',item.price)"><span slot="append">{{item.currency_name}}</span></Input></Col>
                                        <Col span="2" style="line-height: 36px;text-align: center;"><i class="iconfont icon-jiaohuan" /></Col>
                                        <Col span="8"><Input size="large" v-model="coinAmount " placeholder="请输入..." @input="changeMoney('coinAmount',item.price)"><span slot="append" class="blue cursor" @click="allpay(item.amount,item.price)">全部</span></Input></Col>
                                    </Row>
                                </Col>
                                <Col span="4" style="position: relative;top:20px;text-align:right">
                                    <template v-if="paypassword">
                                        <Button size="large" type="primary" @click="createOrder(item.id,1)">下单</Button>
                                        <Button size="large" type="text" @click="cancel">取消</Button>
                                    </template>
                                    <template v-if="!paypassword">
                                        您未设置交易密码，请<Button size="large" type="text">设置</Button>                                        
                                    </template>
                                </Col>
                                <br />
                                <Col span="4">数量：{{item.amount}}</Col>
                                <Col span="4">{{item.minvolume}}~{{item.maxvolume}}</Col>
                                <Col span="12">
                                    <Row>
                                        <Col span="8" style="margin-top:8px;"><Input v-model="emailVerify" size="large" placeholder="邮件验证码" clearable ><span slot="append" class="blue cursor" @click="sendCode">{{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}</span></Input></Col>
                                        <Col span="8" offset="2"><Input v-model="payPassword" type="password" size="large" placeholder="交易密码" clearable /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row class="n2">
                                <Col span="3" v-if="item.bankpay"><i class="iconfont icon-yinxingqia org" /> 银行卡</Col>
                                <Col span="3" v-if="item.wxpay"><i class="iconfont icon-ai-weixin buy" /> 微信支付</Col>
                                <Col span="3" v-if="item.alipay"><i class="iconfont icon-ZFBZD blue" /> 支付宝支付</Col>
                                <Col span="24"></Col>
                                <Col span="16"> <span style="color:red">*</span>备注： {{item.remark}}</Col>
                                <Col span="8" style="textAlign:right">买方付款时限为<span class="torg">30</span>分钟</Col>
                            </Row>
                        </li>                        
                    </ul>
                </dd>
            </dl>
        </div>

        <div class="list">
            <h3>在线出售</h3>
            <dl>
                <dt>
                    <ul >
                        <li>币种</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>操作</li>
                    </ul>
                </dt>
                <dd v-for="(item,index) in sellList">
                    <ul>
                        <li> {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.amount}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li class="tbuy">{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <i v-if="item.bankpay" class="iconfont icon-yinxingqia org" />
                            <i v-if="item.wxpay" class="iconfont icon-ai-weixin buy" />
                            <i v-if="item.alipay" class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(item.id,item.maxvolume,item.minvolume)">{{`购买 ${item.symbol.toUpperCase()}`}}</Button></li>
                        <li v-if="checkMore == item.id" class="more">                            
                            <Row>
                                <Col span="4">{{item.symbol.toUpperCase()}}</Col>
                                <Col span="4" class="tbuy">{{item.price}} {{item.currency_name}}</Col>
                                <Col span="12">
                                    <Row>
                                        <Col span="8"><Input size="large" v-model="currencyAmount" placeholder="请输入..." @input="changeMoney('currencyAmount',item.price)"><span slot="append">{{item.currency_name}}</span></Input></Col>
                                        <Col span="2" style="line-height: 36px;text-align: center;"><i class="iconfont icon-jiaohuan" /></Col>
                                        <Col span="8"><Input size="large" v-model="coinAmount " placeholder="请输入..." @input="changeMoney('coinAmount',item.price)"><span slot="append" class="blue cursor" @click="allpay(item.amount,item.price)">全部</span></Input></Col>
                                    </Row>
                                </Col>
                                <Col span="4" style="position: relative;top:20px;text-align:right">
                                    <template v-if="paypassword">
                                        <Button size="large" type="primary" @click="createOrder(item.id)">下单</Button>
                                        <Button size="large" type="text" @click="cancel">取消</Button>
                                    </template>
                                    <template v-if="!paypassword">
                                        您未设置交易密码，请<Button size="large" type="text">设置</Button>                                        
                                    </template>
                                </Col>
                                <br />
                                <Col span="4">数量：{{item.amount}}</Col>
                                <Col span="4">{{item.minvolume}}~{{item.maxvolume}}</Col>
                                <!-- <Col span="12">
                                    <Row>
                                        <Col span="8" style="margin-top:8px;"><Input size="large" placeholder="邮件验证码" clearable ><span slot="append" class="blue cursor">获取验证码</span></Input></Col>
                                        <Col span="8" offset="2"><Input size="large" placeholder="交易密码" clearable /></Col>
                                    </Row>
                                </Col> -->
                            </Row>
                            <Row class="n2">
                                <Col span="3" v-if="item.bankpay"><i class="iconfont icon-yinxingqia org" /> 银行卡</Col>
                                <Col span="3" v-if="item.wxpay"><i class="iconfont icon-ai-weixin buy" /> 微信支付</Col>
                                <Col span="3" v-if="item.alipay"><i class="iconfont icon-ZFBZD blue" /> 支付宝支付</Col>
                                <Col span="24"></Col>
                                <Col span="16"> <span style="color:red">*</span>备注： {{item.remark}}</Col>
                                <Col span="8" style="textAlign:right">买方付款时限为<span class="torg">30</span>分钟</Col>
                            </Row>
                        </li>                        
                    </ul>
                </dd>           
            </dl>
        </div>
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
                min:0
            };
        },
        created (){
            this.detail()
        },
        mounted(){
            this.userInfo()
        },
        watch:{
            
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
            operation(index,max,min){
                this.coinAmount=null
                this.currencyAmount = null
                this.checkMore = index
                this.max = max
                this.min = min
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
                    this.$store.commit('msg/err', '名称不能为空')
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
                this.axios({
                    url : this.api.detail,
                    data : {
                        user_id:this.$route.query.id
                    }
                }).then(res=>{
                    this.bizInfo = res.data.business_info
                    this.buyList = res.data.buy_list
                    this.sellList = res.data.sell_list
                }) 
            },



            createOrder(id,type){
                if(!this.currencyAmount){
                    this.$store.commit('msg/err', '金额不能为空')
                    return
                }
                if(this.currencyAmount*1 > this.max*1){
                    this.$store.commit('msg/err', '下单金额超过最大限额')
                    return
                }
                if(this.currencyAmount*1 < this.min*1){
                    this.$store.commit('msg/err', '下单金额小于最低限额')
                    return
                }
                if(type){
                    if(!this.emailVerify){
                        this.$store.commit('msg/err', '请输入验证码')
                        return
                    }
                    if(!this.payPassword){
                        this.$store.commit('msg/err', '请输入交易密码')
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
                    this.detail()
                    this.checkMore = null
                    this.coinAmount = null
                    this.currencyAmount = null
                    this.$store.commit('msg/add', res.message)
                }).catch( err=>{
                    this.coinAmount = null
                    this.currencyAmount = null                    
                    this.$store.commit('msg/err', err.message)
                })
            },
            changeMoney(v,price){
                if(v == 'currencyAmount'){                    
                    this.coinAmount = parseFloat((this.currencyAmount / price).toFixed(8))
                }else{                   
                    this.currencyAmount = parseFloat((this.coinAmount * price).toFixed(2))
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
                margin-top:-50px;
                padding:20px 30px;
                text-align:left;
                position: relative;
                z-index:999;
                .n2{
                    border-top:1px dashed #ddd;margin-top:20px;padding-top:20px;
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
</style>
