<template>
    <section class="home-box main-box ico">
        <template v-if="isOpen && !loading">
            <header-component active="assetsrelease" />
            <div class="container">
                <div style="padding:20vh 0;overflow:hidden">
                    <div style="float:left;padding-top:100px;padding-left:20%;width:50%">
                        <p style="color:#333;font-size:40px;margin-bottom:20px"><span style="color:#FF5D43">Thanos X</span> <br v-if="local == 'en'" /> {{lang[local].icoTrade}}</p>
                        <p style="font-size:35px;font-weight:bold">{{lang[local].appCome}} …</p>
                    </div>
                    <div style="float:right;width:50%;text-align:center;"><img src="./assets/images/pc.jpg" alt=""></div>                    
                </div> 
            </div>
            <footer-component />
        </template>

        <template v-if="!isOpen && !loading">
        <header-component active="assetsrelease" />
            <div style="min-height:90vh;">
                <router-view />
            </div>
        <!-- <div class="banner">
            <div class="container">
                <div class="txt"><i class="iconfont iconfont icon-logo"></i> <br /><b v-html="lang[local].icoTit"></b>  </div>
                <ul >
                    <template v-for="(item,index) in list">
                    <li :key="item.id" :class=" index == cur ? (item.last_count !=0 && item.is_disabled !=1) ? 'cur': 'nocur' : (item.last_count ==0 || item.is_disabled ==1) &&  'nocur' " @click=" (item.last_count !=0 && item.is_disabled != 1) && handselect(index)">
                        <p class="tit">{{item.is_default == 1 ? lang[local].icoDefault : item.name}}</p>
                        <p class="num"> {{item.is_default != 0 ? `${item.pay_amount} ${item.pay_coin} = ${item.get_amount} ${item.get_coin}` : `${item.get_amount} ${item.get_coin}`}} <br/>
                        <span> <template v-if="item.get_free_amount > 0"> {{lang[local].icoFree}} {{item.get_free_amount}} {{item.get_coin}}</template></span>
                        </p>
                        <p class="progress"><span class="bar" :style=" 'width:' + (item.total_count - item.last_count) / item.total_count *100 + '%'"></span></p>
                        <p class="total">{{lang[local].icoamount1}} {{item.total_count}} / {{lang[local].icoamount2}} {{item.last_count}} {{lang[local].icoamount3}}</p>
                    </li>
                    </template>
                </ul>
                
            </div>            
        </div> -->
        <!-- <section class="from ">
            <div class="container">
                <div class="ctx">
                    <div class="input">
                        <ul>
                            <li> {{lang[local].icoNum}} : <input type="text"  v-model="num" :disabled="cur > 0 ? true : !loginStatus ? true:false " :style=" (cur > 0 || !loginStatus ) && 'cursor:not-allowed' " style="text-align:left;width:calc(100% - 80px)" @blur="verifyNum" /> </li>
                            <li> {{lang[local].icoPw}} : <input type="password" v-model="pw" style="width:calc(100% - 100px)" :disabled="!loginStatus ? true:false" :style=" !loginStatus && 'cursor:not-allowed' " @focus="verifyNum"/> </li>
                            <li> {{lang[local].icoVerify}} : <input type="text" v-model="verify" style="width:calc(100% - 160px)" :disabled="!loginStatus ? true:false" :style=" !loginStatus && 'cursor:not-allowed' " @focus="verifyNum"/>
                                <span @click=" userData.uid && sendVerify " class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
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
                        <template v-if="loginStatus">
                            <a href="javascript:;" class="submit" @click="createOrders">{{lang[local].icoSubmit}}</a>
                        </template>
                        <template v-if="!loginStatus">
                            <span class="submit"> <a style="color:#eee" :style="local == 'en'&& 'font-size:12px;'" :href="loginUrl">{{lang[local].login2}}</a> <span  style="color:#9BC7D6" >{{lang[local].tradeLogin2}}</span> <a style="color:#eee" :style="local == 'en'&& 'font-size:12px;'" :href="registerUrl">{{lang[local].freeRegister}}</a></span>
                        </template>
                    </div>
                    <div class="amount">{{lang[local].icoUse}}：{{parseFloat(eth)}} {{pay_coin}}    <span>{{lang[local].icoGet}}：{{getcoin}} {{get_coin}}</span></div>                    
                </div>
                <div class="tip">
                    {{lang[local].icotip1}} {{list.length && parseFloat(list[cur].min_buy_count)}} {{lang[local].icotip11}} {{list.length && parseFloat(list[cur].max_buy_count)}} {{lang[local].icotip12}} {{lang[local].icotip2}}{{lang[local].icotip3}}
                </div>               
            </div>            
        </section>
        <section class="list container">
            <div class="tit">{{lang[local].icoBuylog}}</div>
            <list class="finance-coin-table" :url="api.ordersLists" :param="listParam">
                <dl slot="head">
                    <dd>{{lang[local].icotabhead1}}</dd>
                    <dd>{{lang[local].icotabhead2}}</dd>
                    <dd>{{lang[local].icotabhead3}}</dd>
                    <dd>{{lang[local].icotabhead4}}</dd>
                    <dd>{{lang[local].icotabhead5}}</dd>
                    <dd>{{lang[local].icotabhead6}}</dd>
                </dl>
                <dl slot="body" slot-scope="{item}" :key="item.id">
                    <dd>{{localDate(item.buy_time)}}</dd>
                    <dd>{{item.pay_amount}}</dd>
                    <dd>{{item.pay_type.toUpperCase()}}</dd>
                    <dd>{{item.price}}</dd>
                    <dd>{{item.free_amount}}</dd>
                    <dd>{{item.get_amount}}</dd>
                </dl>
            </list>
        </section> -->
        


        <load v-if="getState == getStateStart" />
        <msg />
        <footer-component />
    </template>
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "app",
        data (){
            return {
                loading:true,
                isOpen:false,
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
                count:0
            }
        },

        created (){
            this.getIcoList()
        },
        methods : {
            getIcoList(){
                this.axios({
                    url : this.api.lists,
                    data : {
                    }
                }).then((res) => {
                    res.data
                    this.loading = false
                }).catch((err) => {
                    // this.list = [];
                    this.showStatus = false;
                });
            },
        }
    }
</script>
