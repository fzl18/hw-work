<template>
<div class="c2c">
    <section class="c2cindex container">
        <ul class="type">
            <li @click="handleClass('buy')" :class="curType =='buy' ? 'cur':''">购买</li>
            <li @click="handleClass('sell')" :class="curType =='sell' ? 'cur':''">售出</li>
            <li v-if="loginGetStatus && loginStatus " @click="handleClass('myOrder')" :class="curType =='myOrder' ? 'cur':''">我的委托单</li>
        </ul>
        <div class="seller" v-if="curType == 'myOrder' && status == 4">
            <Row>
                <Col span="12" class="lt">
                    <h2>{{businessInfo.name}}<i class="iconfont icon-bianji org" style="font-size:22px;cursor: pointer;margin:0 20px" @click="editBizName = true"/></h2>
                    <div>入驻时间：{{localDate(businessInfo.checked_time)}}</div>
                </Col>
                <Col span="12" class="rt">
                    <ul>
                        <li><span>{{businessInfo.deposit}}</span><br/>商家保证金</li>
                        <li><span>{{businessInfo.month_orders}}</span><br/>近30天成单</li>
                        <li><span>{{businessInfo.total_orders}}</span><br/>总成单</li>
                        <li><span>{{businessInfo.order_rate}}</span><br/>总成单率</li>
                    </ul>
                </Col>
            </Row>
        </div>
        <div class="coin">
            <div class="tit" v-if="curType != 'myOrder'">
                <a v-for="(item,index) in coinList" href="javascript:;" @click="changeCoin(index)" :class="curCoin == index ?'cur':''">{{item.toUpperCase()}}</a>
            </div>
            <div class="tit" v-if="curType == 'myOrder'">
                <Button v-if="status==4" @click="addOrder" size="large" type="primary" ><i class="iconfont icon-tianjia" style="fontSize:20px;margin-right:10px;"/> 添加委托单</Button>
                <Button v-if="status && status <= 3" size="large" type="primary" :disabled="status == 2 ? true : false" :style="status == 2 ? 'background:#777;color:#fff;':''" @click="$router.push('/apply')"> <i class="iconfont icon-tianjia" style="fontSize:20px;margin-right:10px;"/>  商家申请 </Button>
                <div class="tip" v-if="status == 2 || status == 3"> <span class="torg"> {{status == 2 ? '待审核！':'审核未通过' }}</span> <span v-if="status == 3">理由为：{{remark}}</span> </div>
            </div>
            <div class="search" @click="showSearch">
                <div class="box">
                    <template v-for="(item,index) in searchList">
                        <span v-if="item">{{item=='bankpay'? '银行卡': item=='alipay' ? '支付宝' : item=='wxpay' ? '微信支付' : item}} <Icon type="close" size="12" class="close" @click="delSearchTxt(index)"/></span>
                    </template>
                </div>
                <Poptip trigger="hover" placement="bottom-end" ref="searchBox" :width=460>
                    <Icon type="ios-search" size="26" class="btn"/>
                    <div class="api" slot="content">
                        <table class="select" >
                            <tbody>
                                <template v-if="curType != 'myOrder'">
                                    <tr>
                                        <td>法币币种：</td>
                                        <td>
                                            <Select v-model="searchTxt1.fCoin" size="large" style="width:300px">
                                                <Option v-for="item in currencyList" :value="item.label" :key="item.value">{{ item.label}}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>支付方式：</td>
                                        <td>
                                            <Select v-model="searchTxt1.payType" size="large" style="width:300px">
                                                <Option v-for="item in payList" :value="item" :key="item">{{ item=='bankpay'? '银行卡': item=='alipay' ? '支付宝' : '微信支付' }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="curType == 'myOrder'">
                                    <tr>
                                        <td>日期：</td>
                                        <td>
                                            <DatePicker v-model="searchTxt2.date" size="large" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 300px"></DatePicker>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>交易类型：</td>
                                        <td>
                                            <Select v-model="searchTxt2.transferType" size="large" style="width:300px">
                                                <Option v-for="item in transferType" :value="item" :key="item">{{ item }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>币种：</td>
                                        <td>
                                            <Select v-model="searchTxt2.coin" size="large" style="width:300px">
                                                <Option v-for="item in coinList" :value="item" :key="item">{{ item }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>法币币种：</td>
                                        <td>
                                            <Select v-model="searchTxt2.fCoin" size="large" style="width:300px">
                                                <Option v-for="item in currencyList" :value="item.label" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                </template>
                                <tr>
                                    <td align="center">
                                        <Button size="large" type="text" class="org" @click="allClear">清空筛选</Button>
                                    </td>
                                    <td align="center" >
                                        <Button size="large" type="primary" @click.stop="handleSearch">搜索</Button> <Button size="large" type="text" @click.stop="closeSearch">取消</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Poptip>
            </div>
        </div>
        <div v-if="curType == 'myOrder'" style="margin:20px 0"><span class="torg">*</span> 申请成为商家后，才可OTC交易委托</div>
        <div class="list">
            <dl :class="curType == 'myOrder'?'myOrder':''">
                <dt>
                    <ul v-if="curType != 'myOrder'">
                        <li>商家</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>操作</li>
                    </ul>
                    <ul v-if="curType == 'myOrder'">
                        <li>币种</li>
                        <li>交易类型</li>
                        <li>数量</li>
                        <li>限额</li>
                        <li>单价</li>
                        <li>支付方式</li>
                        <li>时间</li>
                        <li>操作</li>
                    </ul>
                </dt>
                <dd v-for="(item,index) in pendListArray">
                    <ul v-if="curType != 'myOrder'" >
                        <li><span @click="$router.push(`/biz?id=${item.uid}`)" class="tblue cursor">{{item.business_name}}</span> ({{item.month_orders}})</li>
                        <li>{{item.amount}} {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.currency_name}}</li>
                        <li class="tbuy">{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <i v-if="item.bankpay" class="iconfont icon-yinxingqia org" />
                            <i v-if="item.wxpay" class="iconfont icon-ai-weixin buy" />
                            <i v-if="item.alipay" class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li><Button size="large" type="primary" :loading="false" @click="operation(index)">{{curType == 'buy' ? `购买 ${coinList[curCoin].toUpperCase()}` : `售出 ${coinList[curCoin].toUpperCase()}`}}</Button></li>
                        <li v-if="checkMore == index" class="more">                            
                            <Row>
                                <Col span="4">{{item.business_name}} ({{item.month_orders}})</Col>
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
                                    <template v-if="loginGetStatus && loginStatus && !paypassword">
                                        您未设置交易密码，请<Button size="large" type="text" @click="$router.push(toUrl.financeUrl + '/setTradePassword')">设置</Button>                                        
                                    </template>
                                    <template v-if="!loginGetStatus || !loginStatus">
                                        您未登陆，请<Button size="large" type="text" @click="$router.push(toUrl.loginUrl)">登陆</Button>                                        
                                    </template>
                                    
                                </Col>
                                <br />
                                <Col span="4">数量：{{item.amount}}</Col>
                                <Col span="4">{{item.minvolume}}~{{item.maxvolume}}</Col>
                                <Col span="12">
                                    <Row v-if="curType =='sell'">
                                        <Col span="8" style="margin-top:8px;"><Input size="large" placeholder="邮件验证码" clearable ><span slot="append" class="blue cursor">获取验证码</span></Input></Col>
                                        <Col span="8" offset="2"><Input size="large" placeholder="交易密码" clearable /></Col>
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
                    <ul v-if="curType == 'myOrder'">
                        <li>{{item.symbol.toUpperCase()}}</li>
                        <li :class="item.type == 1 ?'buy':'sell'">{{item.type == 1 ? '购买' : '售出'}}</li>
                        <li>{{item.amount}}</li>
                        <li>{{item.minvolume}}~{{item.maxvolume}} {{item.symbol.toUpperCase()}}</li>
                        <li>{{item.price}} {{item.currency_name}}</li>
                        <li>
                            <i v-if="item.bankpay" class="iconfont icon-yinxingqia org" />
                            <i v-if="item.wxpay" class="iconfont icon-ai-weixin buy" />
                            <i v-if="item.alipay" class="iconfont icon-ZFBZD blue" />
                        </li>
                        <li>{{localDate(item.time)}}</li>
                        <li><Button size="large" type="text" :loading="false" @click="cancelPend(item.id)">{{ `取消委托单`}}</Button></li>
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
            <h1>修改商家名称</h1>
            <table class="editBizName">
                <tr>
                    <td>名称</td>
                    <td align="right"><Input size="large" v-model="business_name"/></td>
                </tr>
                <tr>
                    <td colspan="2">
                        为了隐私安全，仅在OTC交易中显示商家信息，不显示注册信息。商家最长支持10个字符   
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">
                            <Col span="12"><Button type="primary" size="large" @click="saveName">保存</Button></Col>
                            <Col span="6" offset="6"><Button type="text" size="large" @click="editBizName=false">关闭</Button></Col>
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
                editBizName:false,
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
                transferInfoOB:{}
            };
        },
        created (){
            // this.basicInfo()
            this.userInfo()
        },
        mounted(){
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
            }
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
            operation(index){
                this.coinAmount=null
                this.currencyAmount = null
                this.checkMore = index
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
                    console.log(err)
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
                    this.$store.commit('msg/err', '名称不能为空')
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
                    console.log(res);
                    this.coinList = res.data.coin_list
                    this.currencyList = res.data.currency_list
                }).catch( err=>{
                    console.log(err);
                })
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
            personalDetail(){
                this.axios({
                    url : this.api.personalDetail,
                    data : {
                    }
                }).then(res=>{
                    console.log(res);
                    this.status = res.data.status
                    this.remark = res.data.remark
                    if(res.data.status == 4){
                        this.businessInfo = res.data.business_info
                    }
                    
                }).catch( err=>{
                    console.log(err);
                })
            },
            personalPendList(searchInfo){
                if(!searchInfo){
                    searchInfo = {
                        type:this.searchTxt2.transferType =='buy' ? 1 : this.searchTxt2.transferType =='sell' ? 2 : 0,
                        coin:this.searchTxt2.coin,
                        currency:this.searchTxt2.fCoin,
                        from_date: this.searchTxt2.date[0] && dayjs(this.searchTxt2.date[0]).format('YYYY-MM-DD'),
                        to_date: this.searchTxt2.date[1] && dayjs(this.searchTxt2.date[1]).format('YYYY-MM-DD'),
                    }
                }
                this.axios({
                    url : this.api.personalPendList,
                    data : {
                        ...searchInfo,
                        ...this.page
                    }
                }).then(res=>{
                    console.log(res);
                    this.pendListArray = res.data.list
                    this.page = res.data.page                    
                }).catch( err=>{
                    console.log(err);
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
                console.log(this.page)
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
                    console.log(err);
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
                    console.log(err);
                })
            },
            createOrder(id){
                this.axios({
                    url : this.api.createOrder,
                    data : {
                        pend_id:id,
                        money:this.currencyAmount
                    }
                }).then(res=>{
                    this.pendList()
                    this.checkMore = null
                    this.coinAmount = null
                    this.currencyAmount = null
                    this.$store.commit('msg/add', res.message)
                }).catch( err=>{
                    this.checkMore = null
                    this.coinAmount = null
                    this.currencyAmount = null                    
                    this.$store.commit('msg/err', err.message)
                })
            },
            changeMoney(v,price){
                console.log(v)
                if(v == 'currencyAmount'){
                    this.coinAmount = this.currencyAmount / price
                }else{
                    this.currencyAmount = this.coinAmount * price
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
                    console.log(err);
                })
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
</style>
