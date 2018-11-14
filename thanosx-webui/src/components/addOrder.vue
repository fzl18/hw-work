<template>
    <div class="box">
                <div class="header">
                    <h2>{{lang[local].addOrderTip1}}</h2>
                    <dl>
                        <dt>{{lang[local].transferType}}：</dt>
                        <dd :class="curTransferType=='buy'?'cur':''" @click="curTransferType = 'buy'">{{lang[local].c2cBuy}}</dd>
                        <dd :class="curTransferType=='sell'?'cur':''" @click="curTransferType = 'sell'">{{lang[local].c2cSell}}</dd>
                    </dl>
                </div>
                <Row class="body t">
                    <Col span="10">
                        <table>
                            <tbody>
                                <tr>
                                    <td width="100">{{lang[local].c2cCoin}}</td>
                                    <td>
                                        <Select v-model="order.coin" size="large" style="width:300px" :placeholder="lang[local].gu_finance100">
                                            <Option v-for="(item,index) in coinList" :value="item" :key="item">{{ item && item.toUpperCase() }}</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding-top:8px">{{lang[local].num}}</td>
                                    <td style="padding-bottom:10px">
                                        <div class="ka"><input v-model="order.count" size="large" style="width:100%" placeholder="" :max=" curTransferType=='sell'? asset:Infinity"/></div>
                                        <span v-if="curTransferType !='buy'">{{lang[local].icoUse}}： {{asset}} {{order.coin && order.coin.toUpperCase()}}</span> 
                                    </td>
                                </tr>                                
                                
                                <tr>
                                    <td>{{lang[local].addOrderTip2}}</td>
                                    <td>
                                        <CheckboxGroup size="large" v-model="order.payment">
                                            <template v-for="item in transferList">
                                                <Checkbox size="large" :label="item.id" >{{item.name}}</Checkbox>
                                            </template>
                                        </CheckboxGroup>
                                    </td>
                                </tr>                                
                            </tbody>
                        </table>
                    </Col>
                    <Col span="2" align="center">
                        <i class="iconfont icon-jiaohuan" style="font-size:24px;position: relative;top:7px"></i>
                    </Col>
                    <Col span="10" >
                        <table style="width:100%">
                            <tr>
                                <td width="100">{{lang[local].c2cCurrency}}</td>
                                <td>
                                    <Select v-model="order.currency" size="large" style="width:300px" :placeholder="lang[local].gu_finance100">
                                        <Option v-for="item in currencyList" :value="item" :key="item.id">{{ item}}</Option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="padding-top:8px">{{lang[local].unitPrice}}</td>
                                <td>
                                    <div class="ka"><input v-model="order.price" size="large"></input><span v-if="order.currency ">{{order.currency || 'CNY'}}</span></div>
                                    <div>{{lang[local].addOrderTip3}}：<span class="torg"> {{(order.price * order.count).toFixed(2) || '--'}} {{order.currency || ''}}</span></div>
                                </td>
                            </tr>                                                        
                        </table>
                    </Col>                    
                </Row>
                <Row class="body">
                    <Col span="10">
                    <table>
                        <tr>
                            <td colspan="2" width='100'> <span class="torg">*</span> {{lang[local].addOrderTip4}}</td>
                        </tr>
                        <tr>
                            <td width="80">{{lang[local].addOrderTip5}}</td>
                            <td class="ka"><input size="large" v-model="order.min"></input><span v-if="order.currency ">{{order.currency && order.currency.toUpperCase() || 'CNY'}}</span></td>
                        </tr>
                    </table>
                    </Col>
                    <Col span="10" offset="2">
                        <table>
                            <tr >
                                <td colspan="2" ></td>
                            </tr>
                            <tr>
                                <td width='100'>{{lang[local].addOrderTip6}}</td>
                                <td class="ka"><input size="large" v-model="order.max"></input><span v-if="order.currency">{{order.currency && order.currency.toUpperCase() || 'CNY'}}</span></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="body b">
                    <Col>
                        <table width='100%'>
                            <tr>
                                <td width='80'>{{lang[local].addOrderTip7}}</td>
                                <!-- <td><Input size="large" type="textarea" :rows="4" v-model="order.note"/></td> -->
                                <td><textarea v-model="order.note" type="textarea" :rows="3" :placeholder="lang[local].addOrderTip8" @input='validateTxt'/><br/> <span style="color:#bbb">{{lang[local].addOrderTip9}} {{ 200 - (order.note && order.note.length || 0)}} {{lang[local].addOrderTip10}}</span></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="footer">
                    <Col span="10"><Checkbox v-model="order.agree" size="large">{{lang[local].loginAgree}} <a :href="tourl + '/list/c2c_legal_service_greement'" class="org" target="_blank">{{lang[local].addOrderTip11}}</a></Checkbox>  </Col>
                    <Col span="4" offset="2"><Button size="large" type="primary" @click="ok" style="width:100%;fontSize:16px">{{lang[local].apply36}}</Button></Col>
                    <Col span="4"><Button size="large" type="text" @click="close" style="width:100%;fontSize:16px" class="org">{{lang[local].cancel}}</Button></Col>
                </Row>
            </div>
</template>

<script>
export default {
    props:['url','params','url2'],
    data(){
        return{                     
            curTransferType:'buy',   
            order:{
                coin:'',
                count:null,
                currency:'',
                payment:[],
                price:null,
                min:null,
                max:null,
                note:'',
                agree:false,
            },
            coinList:[],
            currencyList:[],
            tourl:'',
            transferList:[],
        }
    },
    created(){
        this.basicInfo()
        this.pendCurrencyList()
    },
    mounted(){
        this.tourl = process.env.NODE_ENV == 'development' ? '/article.html' : '/home/article'
        console.log(this.params);
        
    },
    watch:{
        curTransferType(){
            this.order = {
                coin:'',
                count:null,
                currency:'',
                payment:[],
                price:null,
                min:null,
                max:null,
                note:'',
                agree:false,
            }
        },
        'order.price' (n,o){
            let numlength = 2
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.order.price = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            if(this.order.price && this.order.count){
                this.order.max = (this.order.price * this.order.count).toFixed(2)
            }
        },
        "order.min" (n,o){
            let numlength = 2
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.order.min = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            if(this.order.min < 0){
                this.order.min = 0
            }
        },
        "order.max" (n,o){
            let numlength = 2
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.order.max = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            if(this.order.max < 0){
                this.order.max = 0
            }            
        },
        "order.count" (n,o){
            let numlength = 8
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.order.count = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            if(this.curTransferType=='sell'){
                if(this.order.count >this.asset){
                    this.order.count = this.asset
                }
                if(this.order.count < 0){
                    this.order.count = 0
                }
            }
            if(this.order.price && this.order.count){
                this.order.max = (this.order.price * this.order.count).toFixed(2)
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
        asset(){
            let val = 0
            if(this.params && this.params.c2c_asset_list){
                this.params.c2c_asset_list.map(d =>{
                    if(d.coin == this.order.coin){
                        val = d.available
                    }
                })
            }
            
            return val
        }
    },
    methods:{
        ok(){
            const d = this.order
            if(!d.coin){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr1)
                return
            }
            if(!d.count){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr2)
                return
            }
            if(!d.price){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr3)
                return
            }
            if(d.payment.length == 0){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr9)
                return
            }            
            if(!d.min){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr4)
                return
            }
            if(!d.max){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr5)
                return
            }
            if(d.min*1 > d.max*1 ){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr6)
                return
            }
            if(d.max*1 > (d.count * d.price)){
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr7)
                return
            }
            if(this.order.agree){
                this.$emit('ok',{...this.order,type:this.curTransferType =='buy' ? 1:2})
                this.order = {
                    coin:'',
                    count:null,
                    currency:'',
                    payment:[],
                    price:null,
                    min:null,
                    max:null,
                    note:'',
                    agree:false,
                }
            }else{
                this.$store.commit('msg/err', this.lang[this.local].addOrderErr8)
                return
            }
            
        },
        close(){
            this.$emit('close')
            this.order = {
                coin:'',
                count:null,
                currency:'',
                payment:[],
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
                this.coinList = res.data.coin_list
            }).catch( err=>{
                console.log(err);
            })
        },

        pendCurrencyList(){
            this.axios({
                url : this.url2,
                data : {

                }
            }).then(res=>{
                this.currencyList = res.data.currency_list
                this.transferList = res.data.transfer_list
            }).catch( err=>{
                console.log(err);
            })
        },

        validateTxt(){
            if(this.order.note.length > 200){
                this.order.note = this.order.note.substring(0,200)
            }        
        }
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
            &.t{
                border-top:1px dashed #ddd;
                margin-top:20px;
                padding-top:20px;
            }
            &.b{
                border-bottom:1px dashed #ddd;
                margin-bottom:20px;
                padding-bottom:20px;
            }
            
            font-size: 15px;
            table{
                width:100%;
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
    .ka{
        position: relative;
        input{
            border-radius:4px;
            border:1px solid #dddee1;
            line-height:32px;
            padding:0 10px;
            
            width:100%;
            transition:all .3s;
            &:focus, &:hover{
                &+span{border-left:1px solid #FF6600;}
                border:1px solid #FF6600;
            }
        }
        span{
            border-radius:0 4px 4px 0;
            border:1px solid #dddee1;
            border-left: none;
            line-height:32px;
            display: inline-block;
            padding:0 10px;
            min-width:55px;
            background: #eee;
            position:absolute;
            right:0;
        }
    }
    textarea{
        border:1px solid #E7E7E7;
        border-radius: 4px;
        width:91%;
        outline: none;
        padding:10px;
        line-height:28px;
        transition: all .3s;
        &:hover, &:focus{
            border-color: #FF6600
        }
    }
</style>

