<template>
    <div class="box">
                <div class="header">
                    <h2>添加C2C委托单</h2>
                    <dl>
                        <dt>交易类型：</dt>
                        <dd :class="curTransferType=='buy'?'cur':''" @click="curTransferType = 'buy'">购买</dd>
                        <dd :class="curTransferType=='sell'?'cur':''" @click="curTransferType = 'sell'">售出</dd>
                    </dl>
                </div>
                <Row class="body">
                    <Col span="10">
                        <table>
                            <tbody>
                                <tr>
                                    <td width="100">币种</td>
                                    <td>
                                        <Select v-model="order.coin" size="large" style="width:300px">
                                            <Option v-for="(item,index) in coinList" :value="item" :key="item">{{ item && item.toUpperCase() }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>数量</td>
                                    <td>
                                        <InputNumber v-model="order.count" size="large" style="width:100%" :min="0"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>法币币种</td>
                                    <td>
                                        <Select v-model="order.currency" size="large" style="width:300px">
                                            <Option v-for="item in currencyList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>单价</td>
                                    <td>
                                        <Input v-model="order.price" size="large"><span slot="append">{{order.currency || 'CNY'}}</span></Input>
                                        <div>总价：<span class="torg"> {{(order.price * order.count) || '--'}} {{order.currency || 'CNY'}}</span></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>收款方式</td>
                                    <td>
                                        <CheckboxGroup size="large" v-model="order.payment">
                                            <Checkbox size="large" label="1" value="1" disabled>银行卡</Checkbox>
                                            <Checkbox v-if="params.wxpay" size="large" label="3" value="2">微信</Checkbox>
                                            <Checkbox v-if="params.alipay" size="large" label="2" value="3">支付宝</Checkbox>
                                        </CheckboxGroup>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col span="10" offset="2">
                        <table style="width:100%">
                            <tr>
                                <td colspan="2"> <span class="torg">*</span> 单笔交易设置</td>
                            </tr>
                            <tr>
                                <td width="80">最小交易</td>
                                <td><Input size="large" v-model="order.min"><span slot="append">{{order.currency && order.currency.toUpperCase() || 'CNY'}}</span></Input></td>
                            </tr>
                            <tr>
                                <td>最大交易</td>
                                <td><Input size="large" v-model="order.max"><span slot="append">{{order.currency && order.currency.toUpperCase() || 'CNY'}}</span></Input></td>
                            </tr>
                            <tr>
                                <td>备注说明</td>
                                <td><Input size="large" type="textarea" :rows="4" v-model="order.note"/></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="footer">
                    <Col span="6"><Checkbox v-model="order.agree" size="large">已阅读并同意 <a href="#" class="org" target="_blank">服务协议</a></Checkbox>  </Col>
                    <Col span="4" offset="4"><Button size="large" type="primary" @click="ok" style="width:100%;fontSize:16px">确认</Button></Col>
                    <Col span="4"><Button size="large" type="text" @click="close" style="width:100%;fontSize:16px" class="org">取消</Button></Col>
                </Row>
            </div>
</template>

<script>
export default {
    props:['url','params'],
    data(){
        return{                     
            curTransferType:'buy',   
            order:{
                coin:'',
                count:null,
                currency:'',
                payment:['1'],
                price:null,
                min:null,
                max:null,
                note:'',
                agree:false,
            },
            coinList:[],
            currencyList:[],
        }
    },
    created(){
        this.basicInfo()
    },
    mounted(){
        console.log(this.order)        
    },
    watch:{
        curTransferType(){
            this.order = {
                coin:'',
                count:null,
                currency:'',
                payment:['1'],
                price:null,
                min:null,
                max:null,
                note:'',
                agree:false,
            }
        }
    },
    computed:{
        // order(){
        //     let data
        //     if(this.curTransferType == 'buy'){
        //         data = { ...this.orderBuy}
        //     }else{
        //         data = {...this.orderSell}
        //     }
        //     return data
        // }
    },
    methods:{
        ok(){
            const d = this.order
            if(!d.coin){
                this.$store.commit('msg/err', '请选择币种')
                return
            }
            if(!d.count){
                this.$store.commit('msg/err', '请填写数量')
                return
            }
            if(!d.price){
                this.$store.commit('msg/err', '请填写单价')
                return
            }
            if(!d.min){
                this.$store.commit('msg/err', '最小交易不能为空')
                return
            }
            if(!d.max){
                this.$store.commit('msg/err', '最大交易不能为空')
                return
            }
            if(d.min > d.max ){
                this.$store.commit('msg/err', '最小交易值不能大于最大交易值')
                return
            }
            if(d.max > (d.count * d.price)){
                this.$store.commit('msg/err', '最大交易值不能大于总价')
                return
            }
            if(this.order.agree){
                this.$emit('ok',{...this.order,type:this.curTransferType =='buy' ? 1:2})
                this.order = {
                    coin:'',
                    count:null,
                    currency:'',
                    payment:['1'],
                    price:null,
                    min:null,
                    max:null,
                    note:'',
                    agree:false,
                }
            }else{
                this.$store.commit('msg/err', '必须先同意服务协议')
                return
            }
            
        },
        close(){
            this.$emit('close')
            this.order = {
                coin:'',
                count:null,
                currency:'',
                payment:['1'],
                price:null,
                min:null,
                max:null,
                note:'',
                agree:false,
            }
        },
        basicInfo(){
            this.axios({
                url : this.url,
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
    }
}
</script>

<style lang="scss" scoped>
    .box{
        dl{
            overflow: hidden;
            margin-top:20px;
            dd{
                padding:0 80px;
                border-bottom:3px solid #A5A5A5;
                cursor: pointer;
                margin-right:5px;
                &:hover, &.cur{
                    color:#FF6300;
                    border-bottom-color: #FF6300;
                }
            }
            dt,dd{
                float: left;
                font-size: 15px;
                padding-bottom:10px;                
            }
            
        }
        .header{
            // padding:0 50px;
        }
        .body{
            margin:20px 0;
            padding:20px 0px;
            border-top:1px dashed #ddd;
            border-bottom:1px dashed #ddd;
            font-size: 15px;
            table{
                td{
                    height:50px;
                }
            }
        }
        .footer{
            // padding:0 50px;
            font-size: 16px;
        }
    }
</style>

