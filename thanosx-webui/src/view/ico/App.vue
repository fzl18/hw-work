<template>
    <section class="home-box main-box ico">
        <header-component active="ico" />
        <div class="banner">
            <div class="container">
                <div class="txt"><i class="iconfont iconfont icon-logo"></i> <br /><b v-html="lang[local].icoTit"></b>  </div>
                <ul >
                    <template v-for="(item,index) in list">
                    <li :key="item.id" :class=" index == cur ?  'cur' : '' " @click="handselect(index)">
                        <p class="tit">{{item.name}}</p>
                        <p class="num"> {{item.is_default != 0 ? `${item.pay_amount} ${item.pay_coin} = ${item.get_amount} ${item.get_coin}` : `${item.get_amount} ${item.get_coin}`}} <br/>
                        <span> <template v-if="item.get_free_amount > 0"> {{lang[local].icoFree}} {{item.get_free_amount}} {{item.get_coin}}</template></span>
                        </p>
                        <p class="progress"><span class="bar" :style=" 'width:' + (item.total_count - item.last_count) / item.total_count *100 + '%'"></span></p>
                        <p class="total">{{lang[local].icoamount1}} {{item.total_count}} / {{lang[local].icoamount2}} {{item.last_count}} {{lang[local].icoamount3}}</p>
                    </li>
                    </template>
                </ul>
                
            </div>            
        </div>
        <section class="from ">
            <div class="container">
                <div class="ctx">
                    <div class="input">
                        <ul>
                            <li> {{lang[local].icoNum}}<input type="text" v-model="num" :disabled="cur > 0 ? true : false " :style="cur > 0 && 'cursor:not-allowed' " style="text-align:right;"/> <span>{{pay_coin}}</span> </li>
                            <li> {{lang[local].icoPw}}<input type="password" v-model="pw" /> </li>
                            <li> {{lang[local].icoVerify}}<input type="text" v-model="verify" />
                                <span @click="sendVerify" class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
                                    {{
                                        verifyCodeTimeText == -1
                                        ? lang[local].getVerifCode + '...'
                                        : verifyCodeTimeText
                                        ? verifyCodeTimeText
                                        : lang[local].getVerifCode
                                    }}
                                </span>
                             
                             </li>
                        </ul>
                        <a href="javascript:;" class="submit" @click="createOrders">{{lang[local].icoSubmit}}</a>
                    </div>
                    <div class="amount">{{lang[local].icoUse}}：{{eth}} {{pay_coin}}    <span>{{lang[local].icoGet}}：{{getcoin}} {{get_coin}}</span></div>                    
                </div>
                <div class="tip">
                    {{lang[local].icotip}}
                </div>               
            </div>            
        </section>
        <section class="list container">
            <div class="tit">{{lang[local].icoBuylog}}</div>
            <list class="finance-coin-table" :url="api.ordersLists" >
                <dl slot="head">
                    <dd>{{lang[local].icotabhead1}}</dd>
                    <dd>{{lang[local].icotabhead2}}</dd>
                    <dd>{{lang[local].icotabhead3}}</dd>
                    <dd>{{lang[local].icotabhead4}}</dd>
                    <dd>{{lang[local].icotabhead5}}</dd>
                    <dd>{{lang[local].icotabhead6}}</dd>
                </dl>
                <dl slot="body" slot-scope="{item}" :key="item.id">
                    <dd>{{item.buy_time}}</dd>
                    <dd>{{item.pay_amount}}</dd>
                    <dd>{{item.pay_type}}</dd>
                    <dd>{{item.price}}</dd>
                    <dd>{{item.free_amount}}</dd>
                    <dd>{{item.get_amount}}</dd>
                </dl>
            </list>
        </section>
        
        <load v-if="getState == getStateStart" />
        <msg />
        <footer-component />
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "app",
        data (){
            return {
                list : [],
                cur : 0,
                verify:'',
                num:'',
                pw:'',
                get_coin:'',
                pay_coin:'',
                sendCodeCount : 0,
                param : {
                    verify : '',
                },
                eth:0,
            }
        },
        watch : {
            "param.verify" (n, o){
                if(n.length > this.verifCodeLen){
                    this.param.verify = o;
                    return;
                };
                this.param.verify = n.replace(/[^0-9]*/g, '');
            },
            "num" (n, o){
                this.num = n && n.replace(/[^0-9]*/g, '');
            },
        },
        computed : {
            getcoin(){
                if(this.list.length){
                     return this.cur ? (parseInt(this.list[this.cur].get_amount) + parseInt(this.list[this.cur].get_free_amount)) : this.num * parseInt(this.list[this.cur].get_amount)
                }
            },
            ...mapState(['info'])
        },

        mounted (){
            this.getIcoList()
        },
        methods : {
            getIcoList(){
                this.axios({
                    url : this.api.ico,
                    data : {
                    }
                }).then((res) => {
                    this.list = res.data.list
                    this.eth = res.data.eth || 0
                    this.get_coin = res.data[0].get_coin
                    this.pay_coin = res.data[0].pay_coin                    
                }).catch((err) => {
                    // this.list = [];
                    this.showStatus = false;
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.ordersVerifyCode,
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                });
            },

            createOrders(){
                if(!this.verify || !this.pw || !this.num){
                    this.$store.commit('msg/err', this.lang[this.local].ico10);
                    return false;
                }
                if(this.num > parseFloat(this.list[this.cur].max_buy_count) || this.num < parseFloat(this.list[this.cur].min_buy_count)){
                    this.$store.commit('msg/err', this.lang[this.local].ico11);
                    return false;
                }
                this.axios({
                    url : this.api.createOrders,
                    data:{
                        pay_password:this.pw,
                        email_verify:this.verify,
                        id:this.list[this.cur].id,
                        buy_count:this.num,
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang[this.local].otc26)
                    this.pw = ''
                    this.verify = ''
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].otc27)
                });
            },


            handselect(index){
                this.cur = index                
                this.num = index && parseInt(this.list[index].max_buy_count) + ''
            }
        }
    }
</script>
