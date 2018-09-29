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
                                        <Select v-model="model4" size="large" style="width:300px">
                                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>数量</td>
                                    <td>
                                        <InputNumber size="large" style="width:100%"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>法币币种</td>
                                    <td>
                                        <Select v-model="model4" size="large" style="width:300px">
                                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>单价</td>
                                    <td>
                                        <Input size="large"><span slot="append">CNY</span></Input>
                                        <div>总价：<span class="torg">--CNY</span></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>收款方式</td>
                                    <td>
                                        <CheckboxGroup size="large" v-model="payment">
                                            <Checkbox size="large" label="银行卡" value="1"></Checkbox>
                                            <Checkbox size="large" label="微信" value="2"></Checkbox>
                                            <Checkbox size="large" label="支付宝" value="3"></Checkbox>
                                        </CheckboxGroup>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col span="10" offset="2">
                        <table style="width:100%">
                            <tr>
                                <td colspan="2">* 单笔交易设置</td>
                            </tr>
                            <tr>
                                <td width="80">最小交易</td>
                                <td><Input size="large" v-model="order.min"><span slot="append">CNY</span></Input></td>
                            </tr>
                            <tr>
                                <td>最大交易</td>
                                <td><Input size="large" v-model="order.max"><span slot="append">CNY</span></Input></td>
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
    data(){
        return{
            curTransferType:'buy',
            payment:[],
            model4:'',
            cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
            order:{
                coinType:'',
                count:'',
                fcoin:'',
                price:0,
                min:0,
                max:0,
                note:'',
                agree:false,
            }
        }
    },
    methods:{
        ok(){
            this.$emit('ok')
        },
        close(){
            this.$emit('close')
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

