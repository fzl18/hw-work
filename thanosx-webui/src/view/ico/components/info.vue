<template>
    <div class="info">
        <load v-if="loading" style="position: relative;top:40vh"/>
        <div v-if="!loading">
        <section class="list b1">
            <div class="container">
                <div class="tit">{{lang[local].ico}}</div>
                <div class="logo"> <img :src="coininfo.logo" alt="" v-if="coininfo.logo" /> <i v-if="!coininfo.logo" class="iconfont icon-zichan_" style="float:left;font-size:40px;color:#ddd;line-height:120px;"></i>  <span>{{coin.toUpperCase()}}<span style="font-weight:normal">-{{coininfo.code_name}}</span> </span>
                    <div class="time" v-if="!isTimeover && isStart && (coininfo.status ==1 || coininfo.status ==2)"> <span style="margin-right:20px" v-if="coininfo.status ==2">{{lang[local].icostop}}</span>{{lang[local].leftTime}}<span> {{leftDay}}{{lang[local].day}} {{leftHour}}{{lang[local].hour}} {{leftMut}}{{lang[local].minute}} {{leftSec}}{{lang[local].second}}</span></div> 
                    <div class="time" v-if="!isTimeover && isStart && coininfo.status !=1"><span> {{ (coininfo.status == 5 || coininfo.status == 4) ? lang[local].timeover : ''}} </span></div>
                    <div class="time" v-if="isTimeover && isStart"><span> {{lang[local].timeover}} </span></div>
                    <div class="time" v-if="!isStart"><span> {{localDate(coininfo.start_time)}} {{lang[local].comesoon}}</span></div>
                </div>
                <div class="txt" v-html="coininfo.content" />
            </div>
            <div class="othInfo">
                <div class="container">
                    <p><span :style=" local =='en' ? '' :'text-align:left;min-width:inherit;'">{{lang[local].iconame}}：</span> {{coininfo.name}}</p>
                    <p><span :style=" local =='en' ? '' :'text-align:left;min-width:inherit;'">{{lang[local].weburl}}：</span> <a :href="coininfo.website_url" target="_blank">{{coininfo.website_url}}</a></p>
                    <p><span :style=" local =='en' ? '' :'text-align:left;min-width:inherit;'">{{lang[local].icoamount}}：</span> {{parseFloat(coininfo.amount*1)}}  {{(coininfo.status == 3 || coininfo.status == 4 || coininfo.status == 5) ? '' : ` /  ${lang[local].icoamount2} ${parseFloat(coininfo.last_amount*1)}`}}</p>
                    <p><span :style=" local =='en' ? '' :'text-align:left;min-width:inherit;'">{{lang[local].icotime}}：</span>{{localDate(coininfo.start_time)}} ~ {{localDate(coininfo.end_time)}}</p>
                </div>
            </div>
        </section>
        <div class="tab container list">
            <div class="tit">{{lang[local].icobuy}}</div>
            <ul class="tab">
                <template v-for="(item,index) in tab">
                <li :key="item.id" :class=" index == cur ? (item.last_count !=0 && item.is_disabled !=1) ? 'cur': 'nocur' : (item.last_count ==0 || item.is_disabled ==1) &&  'nocur' " @click=" (item.last_count !=0 && item.is_disabled != 1) && handselect(index)">
                    <!-- <p class="title">{{item.is_default == 1 ? lang[local].icoDefault : item.name}}</p> -->
                    <p class="num">1{{item.pay_coin_type.toUpperCase()}} = {{parseFloat(item.price*1)}}{{coin.toUpperCase()}}
                    </p>
                    <!-- <p class="progress"><span class="bar" :style=" 'width:' + (item.total_count - item.last_count) / item.total_count *100 + '%'"></span></p> -->
                    <!-- <p class="total">{{lang[local].icoamount1}} {{item.total_count}} / {{lang[local].icoamount2}} {{item.last_count}} {{lang[local].icoamount3}}</p> -->
                </li>
                </template>
            </ul>
        </div>
        <section class="cont">
            <div class="container">
                <div class="ctx">
                    <div class="input">
                        <ul>
                            <li> <span v-html="lang[local].icoNum" />： </span> <input type="text"  v-model="num" :disabled="(!loginStatus || !isStart || isTimeover || coininfo.status !=1) ? true : false " :style="(!loginStatus || !isStart || isTimeover || coininfo.status !=1) && 'cursor:not-allowed;background: none;' " style="text-align:left;width:calc(100% - 100px)" @blur="verifyNum" /> </li>
                             <div class="amount">{{lang[local].icoUse}}：{{tab[cur] && parseFloat(tab[cur].asset_coin *1)}} {{tab[cur] && tab[cur].pay_coin_type.toUpperCase()}}    <span>{{lang[local].icoGet}}：<span style="color:#FF4F00">{{getcoin}} {{coin.toUpperCase()}}</span></span></div>
                            
                            <li> {{lang[local].icoPw}}： <input type="password" v-model="pw" :disabled="(!loginStatus || !isStart || isTimeover || coininfo.status !=1) ? true:false" :style=" (!loginStatus  || !isStart || isTimeover || coininfo.status !=1) && 'cursor:not-allowed;background: none;'  " style="width:calc(100% - 100px)" @focus="verifyNum"/> </li>
                            <li><span v-html="lang[local].icoVerify" />： <input type="text" v-model="verify" :disabled="(!loginStatus  || !isStart || isTimeover || coininfo.status !=1) ? true:false" :style=" (!loginStatus  || !isStart || isTimeover || coininfo.status !=1) && 'cursor:not-allowed;background: none;' " style="width:calc(100% - 200px)" @focus="verifyNum"/>
                                <span @click="!loginStatus ? '' : sendVerify() " class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
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
                        <section class="login-form-group">
                            <label class="checkbox-my">
                                <input type="checkbox" v-model="agreement" />
                                <i class="iconfont " :class=" !agreement ? 'icon-huisekuang':'icon-icon2' "></i>
                                {{lang[local].loginAgree}}  <a :href="articleUrl + '/list/ico_protocol'" target="_blank">{{lang[local].icoselltip10}} </a></a> 
                            </label> 
                        </section>
                        <template v-if="loginStatus">
                            <a href="javascript:;" class="submit" @click="createOrders" :disabled="(!isStart || isTimeover || coininfo.status !=1) ? true:false" :style=" (!isStart || isTimeover || coininfo.status !=1) && 'cursor:not-allowed;' ">{{!isStart ? lang[local].comesoon : isTimeover ? lang[local].timeover : coininfo.status !=1 ? lang[local].icostop : lang[local].icoSubmit}}</a>
                        </template>
                        <template v-if="!loginStatus">
                            <span class="submit"> <a style="color:#eee" :href="loginUrl">{{lang[local].login2}}</a> <span  style="color:#9BC7D6" >{{lang[local].tradeLogin2}}</span> <a style="color:#eee" :href="registerUrl">{{lang[local].freeRegister}}</a></span>
                        </template>
                    </div>
                </div>
                <div class="tip">
                    <p>{{lang[local].icotip1}}</p>
                    <p>{{lang[local].icotip10}} <span style="color:#FF4F00">{{tab.length && parseFloat(tab[cur].min_limit)}}{{tab[cur] && tab[cur].pay_coin_type.toUpperCase()}}</span> {{lang[local].icotip11}} <span style="color:#FF4F00">{{tab.length && parseFloat(tab[cur].max_limit)}}{{tab[cur] && tab[cur].pay_coin_type.toUpperCase()}}</span> {{lang[local].icotip12}} </p>
                    <p>{{lang[local].icotip2}}</p>
                    <p>{{lang[local].icotip3}}</p>                    
                </div>               
            </div>            
        </section>
        <section class="list container">
            <div class="tit">{{lang[local].icoBuylog}}</div>
            <list class="finance-coin-table" :url="api.ordersLists" :param="listParam">
                <dl slot="head">
                    <dd style="width:30%">{{lang[local].icotabhead1}}</dd>
                    <dd style="width:10%">{{lang[local].icotabhead2}}</dd>
                    <dd style="width:20%">{{lang[local].icotabhead3}}</dd>
                    <dd style="width:30%">{{lang[local].icotabhead4}}</dd>
                    <!-- <dd>{{lang[local].icotabhead5}}</dd> -->
                    <dd style="width:10%">{{lang[local].icotabhead6}}</dd>
                </dl>
                <dl slot="body" slot-scope="{item}" :key="item.id">
                    <dd style="width:30%">{{localDate(item.buy_time)}}</dd>
                    <dd style="width:10%">{{item.ico_type.toUpperCase()}}</dd>
                    <dd style="width:20%">{{item.pay_amount}}{{item.pay_type.toUpperCase()}}</dd>
                    <dd style="width:30%">1{{item.pay_type.toUpperCase()}} = {{item.price}}{{item.ico_type.toUpperCase()}}</dd>
                    <!-- <dd>{{item.free_amount}}</dd> -->
                    <dd style="width:10%">{{item.get_amount+''}}</dd>
                </dl>
            </list>
        </section>
        
        <msg />
        </div>
    </div>
    
</template>


<script>
    import {mapState} from "vuex";
    import BigNumber from "bignumber.js";
    export default {
        name: "app",
        data (){
            return {
                loading:true,
                isOpen:false,
                coininfo: {},
                tab:[],
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
                count:0,
                leftDay:0,
                leftSec:0,
                leftHour:0,
                leftMut:0,
                coin:this.$route.params.xnb,
                isTimeover:false,
                isStart:true,
                id:0,
                agreement:false,
            }
        },
        watch : {
            local(){
                this.getInfo()
            },
            "param.verify" (n, o){
                if(n.length > this.verifCodeLen){
                    this.param.verify = o;
                    return;
                };
                this.param.verify = n.replace(/[^0-9]*/g, '');
            },
            "num" (n, o){
                let numlength = this.tab[this.cur].decimal_limit || 2
                let v = ''
                for(let k=0;k<numlength;k++){
                    v += '\\d'
                }
                let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
                this.num = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            },
        },
        computed : {
            listParam (){
                return {
                    count : this.count,
                    id: this.id,
                };
            },
            getcoin(){
                if(this.tab.length){
                     return this.num ? parseFloat(BigNumber(this.num).multipliedBy(BigNumber(this.tab[this.cur].price))) : 0
                }
            },
            // ...mapState(['info'])
            ...mapState('login',['loginInfo','loginStatus','loginGetStatus'])
        },

        created (){
            this.getInfo()
            this.id = this.$route.params.id
        },
        methods : {
             //倒计时
            countTime(endDate,sertime,timer) {
                //获取当前时间
                let date = new Date();
                let now = (sertime*1000 + (timer*1000)) || date.getTime();
                //设置截止时间
                // let endDate = endTime || new Date("2016-10-22 23:23:23");
                let end = endDate *1000
                //时间差
                let leftTime2 = end-now;
                if (leftTime2>=0) {
                    this.leftDay = Math.floor(leftTime2/1000/60/60/24);
                    this.leftHour = Math.floor(leftTime2/1000/60/60%24);
                    this.leftMut = Math.floor(leftTime2/1000/60%60);
                    this.leftSec = Math.floor(leftTime2/1000%60)              
                }else{
                    
                }
            },

            getInfo(){
                this.axios({
                    url : this.api.info,
                    data : {
                        id:this.$route.params.id,
                    }
                }).then((res) => {
                    this.loading = false
                    this.coininfo = res.data.item || {}
                    this.tab = res.data.list || []
                    let timer = 0
                    setInterval(()=>{
                        this.countTime(res.data.item.end_time,res.data.time,timer)
                        timer++
                    },1000)

                    const index = []
                    let see = []
                    res.data.list.map((d,i)=>{
                        if(d.last_count != 0 && d.is_disabled !=1){
                            index.push(i)
                        }
                        if(d.is_disabled !=1){
                            see.push(i)
                        }
                    })

                    if( res.data.item.start_time*1000 > new Date().getTime() ){
                        this.isStart = false
                    }
                    if( res.data.item.end_time*1000 < new Date().getTime() ){
                        this.isTimeover = true
                    }
                    // console.log(res.data.item.end_time*1000 > new Date().getTime())

                    // let now = index.length > 0 ? index[0] : 0

                    // this.cur = now              //res.data.list[0].last_count == 0 ? 1 : 0
                    // this.num = res.data.list[now].min_buy_count
                }).catch((err) => {
                    // this.list = [];
                    this.showStatus = false;
                });
            },
            sendVerify (){
                if(!this.loginStatus){
                    this.$store.commit('msg/err', this.lang[this.local].ico20);
                    return false;
                };
                if( !this.isStart || this.isTimeover || this.coininfo.status !=1 ){
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
            verifyNum(){
                
                if(this.num * 1 > this.tab[this.cur].max_limit ){
                    this.num =  parseFloat(this.tab[this.cur].max_limit) 
                }else if(this.num * 1 < this.tab[this.cur].min_limit){
                    this.num = parseFloat(this.tab[this.cur].min_limit)
                }else{
                    this.num = parseFloat((this.num *1).toFixed( this.tab[this.cur].decimal_limit || 2))
                }

                if( this.num.toString() == 'NaN'){
                    this.num = 0
                }
                
            },
            createOrders(){
                if(!this.verify || !this.pw || !this.num){
                    this.$store.commit('msg/err', this.lang[this.local].ico10);
                    return false;
                }
                if(this.num > parseFloat(this.tab[this.cur].max_limit) || this.num < parseFloat(this.tab[this.cur].min_limit)){
                    this.$store.commit('msg/err', this.lang[this.local].ico11);
                    return false;
                }
                if(this.num > parseFloat(this.tab[this.cur].max_limit) || this.num < parseFloat(this.tab[this.cur].min_limit)){
                    this.$store.commit('msg/err', this.lang[this.local].ico11);
                    return false;
                }
                if(this.getcoin > parseFloat(this.coininfo.last_amount)){
                    this.$store.commit('msg/err', this.lang[this.local].ico11);
                    return false;
                }
                if( !this.isStart || this.isTimeover || this.coininfo.status !=1 ){
                    return false;
                };
                if(this.num * 1 > parseFloat(this.tab[this.cur].asset_coin *1)){
                    this.$store.commit('msg/err', this.lang[this.local].webSocketError2);
                    return false;
                }
                if(!this.agreement){
                    this.$store.commit('msg/err', this.lang[this.local].agreementTip);
                    return false;
                }                
                this.axios({
                    url : this.api.createOrders,
                    data:{
                        pay_password:this.pw,
                        email_verify:this.verify,
                        id:this.tab[this.cur].id,
                        buy_count:this.num,
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang[this.local].otc26)
                    this.pw = ''
                    this.verify = ''
                    this.count++
                    clearInterval(this.verifyCodeInterval);
                    this.verifyCodeTimeText = '';
                    this.getInfo()
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].otc27)
                });
            },


            handselect(index){
                // console.log(index)
                this.cur = index                
                // this.num = index && parseInt(this.tab[index].max_buy_count) + ''
            }
        }
    }
</script>

<style lang="scss" scoped>
.info{
    position: relative;
    .b1{background:#FAFBFD;
        padding-top:60px;
        border-top:5px solid #fff;min-height: inherit;font-size:15px;}
    .logo{
        margin:30px 0 20px 0;
        overflow: hidden;
        img{width: 226px;height:90px;float: left;}
        &> span{
            float: left;
            margin: 30px;
            font-size:28px;
            font-weight: bold;
        }
    }
    .txt{margin-bottom: 30px;line-height:24px;}
    .time{
        display: inline-block;
        margin-top:30px;
        text-align: right;
        float: right;
        span{font-size:28px;color: #FF4F00;font-weight: bold;margin-left:20px;}
    }
    .othInfo{
        line-height: 30px;
        margin-top:5px;
        background: #F9F9F9;
        padding:30px 0;
        p{
            span{
                min-width: 125px;
                display: inline-block;
                text-align:right;
            }
        }
    }
    .tab{min-height: inherit;margin-bottom:10px;}
    .cont{
        overflow: hidden;
        margin-bottom:80px;
        ul{margin-right:10%}
        li{
            border-bottom: 3px solid #EEE;
            padding-bottom: 2px;
            font-size:16px;
            font-weight:bold;
            margin:20px 0;
            margin-top:40px;
            &:last-child{
                margin-bottom: 50px;
            }
            input{
                border:none;
                line-height:30px;
                width:100%;
            }
        }
        .submit{
            display:block;
            background: #FF4F00;
            width:90%;
            text-align: center;
            color: #fff;
            line-height: 50px;
            height:50px;
            font-size:18px;
        }
        .getVerifCode{
            cursor: pointer;
            color: #FF4F00;
            text-align: right;
            float: right;
        }
        .ctx{float: left;width:40%;margin-right:20px;}
        .amount{
            span{float: right;}
        }
        .tip{
            float: left;width:50%;
            margin-top: 20px;
            font-size:15px;
            p{
                line-height: 35px;
                margin:20px 0;
                &:first-child{
                    margin-bottom:20px;
                    color:#FF4F00;
                    font-size:16px;
                }
            }
        }
    }
    .login-form-group{
        margin-bottom:20px;
        font-size:16px;
    }

}
    
</style>
