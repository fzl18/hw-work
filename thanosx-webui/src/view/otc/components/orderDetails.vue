<template>
    <section class="order-details">
        <section class="ewm" @click="ewm = ''" v-if="ewm">
            <load></load>
            <img :src="imgUrl(ewm)" @error="$store.commit('msg/err', lang.otc28); ewm = '';" alt="">
        </section>
        <section class="otc-trade-box order-details-box">
            <h4>
                <span v-if="item.buyer == loginInfo.uid">
                    {{lang.otc29}} {{item.buyer == loginInfo.uid ? item.sellername : item.buyername}} {{lang.otc30}}
                </span>
                <span v-else>
                    {{item.buyer == loginInfo.uid ? item.sellername : item.buyername}} {{lang.otc31}}
                </span>
                {{item.amount || 0}} {{upperCase(item.symbol)}}
                <span class="close" @click="$emit('closeDetails')"></span>
            </h4>
            <dl>
                <dt>{{lang.orderId}}：</dt>
                <dd>{{item.id}}</dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.object}}：</dt>
                <dd>{{item.buyer == loginInfo.uid ? item.sellername : item.buyername}}</dd>
            </dl>
            <dl>
                <dt>{{lang.type}}/{{lang.currency}}：</dt>
                <dd :class="item.buyer == loginInfo.uid ? 'buyColor' : 'sellColor'">{{item.buyer == loginInfo.uid ? lang.buy : lang.sell}}/ {{upperCase(item.symbol)}}</dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.num}}：</dt>
                <dd>{{numDecimals(item.amount)}}</dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.price}}：</dt>
                <dd>{{rmbDecimals(item.price || (item.pend_type == 1 ? '0.99' : '1'))}} CNY</dd>
            </dl>
            <dl>
                <dt>{{lang.otcTrade}}{{lang.total}}：</dt>
                <dd>{{rmbDecimals((item.price || (item.pend_type == 1 ? '0.99' : '1')) * item.amount)}} CNY</dd>
            </dl>
            <dl class="border"></dl>
            <dl v-if="pay.bank_title && item.buyer == loginInfo.uid">
                <dt>{{lang.bankCard}}：</dt>
                <dd>{{pay.bank_title}}， {{pay.bank_card.replace(/([0-9]{4})/g,"$1 ")}}， {{pay.bank_user}}， {{pay.bank_addr}}</dd>
            </dl>
            <dl v-if="pay.alipay && item.buyer == loginInfo.uid">
                <dt>{{lang.aliPay}}：</dt>
                <dd>{{pay.alipay}}  <span class="mainColor" style="cursor: pointer;font-size: 14px;" @click="ewm = pay.alipaycode">{{lang.otc32}}</span></dd>
            </dl>
            <dl v-if="pay.wechatpay && item.buyer == loginInfo.uid">
                <dt>{{lang.weChat}}：</dt>
                <dd>{{pay.wechatpay}} <span class="mainColor" style="cursor: pointer;font-size: 14px;" @click="ewm = pay.wechatpaycode">{{lang.otc32}}</span></dd>
            </dl>

            <dl>
                <dt>{{lang.otc33}} ：</dt>
                <dd>{{item.buyer == loginInfo.uid ? pay.moble_sell : pay.moble_buy}}</dd>
            </dl>

            <div class="state-dec" v-if="item.status == 0">
                {{orderStatusText(item.status)}} ，
                <span v-if="item.buyer == loginInfo.uid">{{lang.otc34}} </span>
                <span v-else>{{item.buyer == loginInfo.uid ? item.sellername : item.buyername}} {{lang.otc35}}</span>

                <span class="mainColor">{{timerText}}</span> {{lang.otc36}}，
                {{lang.transferNote}}：<span class="mainColor remark">{{item.code}}</span><small class="red">{{lang.otc37}}</small>
            </div>
            <div class="state-dec" v-else-if="item.status == 3">
                {{orderStatusText(item.status)}} ，
                <span v-if="item.buyer == loginInfo.uid">{{lang.otc38}} {{item.buyer == loginInfo.uid ? item.sellername : item.buyername}} {{lang.otc40}}</span>
                <span v-else>{{item.buyer == loginInfo.uid ? item.sellername : item.buyername}} {{lang.otc41}}</span>
                <span class="mainColor">{{timerText}}</span>
                ，{{lang.transferNote}}：<span class="mainColor remark">{{item.code}}</span>
                <small>{{lang.otc37}}</small>。
                <span v-if="item.seller == loginInfo.uid">{{lang.otc53}} <a href="javascript:;" @click="appeal" class="mainColor remark">{{lang.appeal}}{{appealState == getStateStart ? '...' : ''}}</a></span>
            </div>
            <div class="state-dec" v-else>
                {{orderStatusText(item.status)}} ，
                {{lang.transferNote}}：<span class="mainColor remark">{{item.code}}</span>
                <small>{{lang.otc37}}</small>
            </div>
            <dl v-if="(item.status == 0 && item.buyer == loginInfo.uid) || (item.status == 3 && item.buyer != loginInfo.uid) ">
                <dd>
                    <a @click="confirm" href="javascript:;" class="trade-btn">
                        {{item.status == 0  ? lang.otc42 : lang.otc43}} {{rmbDecimals((item.price || (item.pend_type == 1 ? '0.99' : '1')) * item.amount)}} CNY
                        {{getStateText()}}
                    </a>
                </dd>
            </dl>
            <div class="order-details-remark"  v-if="item.buyer == loginInfo.uid && item.status == 0" v-html="lang.otc44">
            </div>
            <div class="order-details-remark" v-if="item.buyer != loginInfo.uid && item.status == 3" v-html="lang.otc45">
            </div>
        </section>
    </section>
</template>

<script>
    export default {
        name: "orderDetails",
        props : ['item', 'payData'],
        data (){
            return {
                ewm : '',
                timer : null,
                appealState : -1,
                timerText : '0:0',
                pay : {},
                origin : process.env.NODE_ENV == 'development' ? 'http://clt.vroot.win' : ''
            }
        },
        watch : {
            payData (n, o){
                this.pay = this.payData;
            },
        },
        beforeDestroy (){
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
            };
        },
        created (){
            if(this.payData){
                this.pay = this.payData;
                this.downTime();
            }else{
                this.bankdetail();
            };
        },
        methods : {
            confirm (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.confirm,
                    data : {
                        order_id : this.item.id
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.confirmS);
                    this.$store.commit('shopDataUpdate');
                    if(this.item.status == 0){
                        this.item.status = 3;
                        this.bankdetail();
                        return;
                    };
                    if(this.item.status == 3){
                        this.item.status = 1;
                        this.bankdetail();
                        return;
                    };
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.confirmE);
                    console.log(err);
                });
            },
            downTime (){
                var self = this;
                var time = self.item.time;
                var time_buyer = self.item && self.item.time_buyer ? true : false;
                if(time_buyer){
                    time = self.item.time_buyer;
                };
                if(typeof time == 'string' && /t/gi.test(time)){
                    var f = new Date(time);
                }else{
                    var f = new Date(time * 1 || time);
                };
                var n = new Date();
                if(time_buyer){
                    f.setHours(f.getHours() + 24);
                }else{
                    f.setHours(f.getHours() + 1);
                };
                var cTime = f.getTime() - n.getTime();
                if(cTime < 1000){
                    self.timerText = '0:0';
                }else{
                    self.downTimeText(cTime);
                    self.timer = setInterval(function (){
                        if(cTime < 1000){
                            self.timerText = '0:0';
                            clearInterval(self.timer);
                        };
                        cTime = cTime - 1000;
                        self.downTimeText(cTime);
                    }, 1000);
                };
            },
            downTimeText (cTime){
                var h = Math.floor((cTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var m = Math.floor((cTime % (1000 * 60 * 60)) / (1000 * 60));
                var s = Math.floor((cTime % (1000 * 60)) / 1000);
                h = this.downTimeLen(h);
                m = this.downTimeLen(m);
                s = this.downTimeLen(s);
                this.timerText = (h > 0 ? h + ':' : '') + m + ':' + s + '';
            },
            downTimeLen (v){
                return v * 1 < 10 ? '0' + v : v;
            },
            appeal (){
                if(this.appealState ==  this.getStateStart){
                    return false;
                };
                this.appealState =  this.getStateStart;
                this.axios({
                    url : this.api.appeal,
                    data : {
                        order_id : this.item.id
                    },
                }).then((res) => {
                    this.$store.commit('shopDataUpdate');
                    this.$store.commit('msg/add', this.lang.appealS);
                    this.$emit('closeDetails');
                }).catch((err) => {
                    this.appealState =  this.getStateError;
                    this.$store.commit('msg/err', err.message || this.lang.appealE);
                    console.log(err);
                });
            },

            bankdetail (){
                this.getStart();
                this.axios({
                    url : this.api.bankdetail,
                    data : {
                        sellid : this.item.seller,
                        buyid : this.item.buyer,
                        pend_id : this.item.pend_id
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.pay = res.data;
                    this.downTime();
                }).catch((err) => {
                    this.getError();
                    console.log(err);
                });
            },
        }
    }
</script>
