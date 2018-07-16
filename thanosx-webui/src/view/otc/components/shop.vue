<template>
    <section>
        <section  class="otc-block">
            <h4 class="otc-title">
                <span>{{lang.shopAdmin}}</span>
                <otc-menu />
            </h4>
            <section class="shop-user">
                <div class="shop-user-left">
                    <i :class="classActive(shopData.status != 1 || shopData.istrade != 1)">{{((shopData.nickname + '') || '').slice(0, 1)}}</i>
                    <div>
                        <h4>{{shopData.nickname}}</h4>
                        <p>UID <b>{{loginInfo.uid}}</b></p>
                        <p>{{lang.registerTime}} <b>{{localDate(shopData.registertime)}}</b></p>
                    </div>
                </div>
                <div class="shop-user-right">
                    <span>
                        <small>{{lang.usable}} CNT</small>
                        <b>{{numDecimals(shopCoin.xnb)}}</b>
                    </span>
                    <span>
                        <small>{{lang.margin}} (CNY) </small>
                        <b>{{rmbDecimals(shopData.deposit)}}</b>
                    </span>
                    <span>
                        <small>{{lang.otc11}}</small>
                        <b>{{shopData.confirmtime}} {{lang.minute}}</b>
                    </span>
                </div>
            </section>
            <ul class="shop-data">
                <li>
                    <span>{{lang.otc12}}</span>
                    <b>{{shopData.amounts}}</b>
                </li>
                <li>
                    <span>{{lang.otc13}}</span>
                    <b>{{shopData.appeal}}</b>
                </li>
                <li>
                    <span>{{lang.otc14}}</span>
                    <b>{{shopData.win}}</b>
                </li>
                <li>
                    <span>{{lang.otc15}}</span>
                    <b>{{shopData.amounts30}}</b>
                </li>
                <li>
                    <span>{{lang.otc16}}</span>
                    <b>{{shopData.appeal30}}</b>
                </li>
                <li>
                    <span>{{lang.otc17}}</span>
                    <b>{{shopData.win30}}</b>
                </li>
            </ul>
            <ul class="shop-state">
                <li>
                    {{lang.realNam}}
                    <a v-if="shopData.nickname" href="javascript:;" :class="classActive(loginInfo.truename)">{{loginInfo.truename ? lang.certified : lang.unauthorized}}</a>
                </li>
                <li>
                    {{lang.otc18}}
                    <a v-if="shopData.nickname" href="javascript:;" :class="classActive(loginInfo.moble)">{{loginInfo.moble ? lang.certified : lang.unauthorized}}</a>
                </li>
                <li>
                    {{lang.otcTrade}}{{lang.state}}
                    <a v-if="shopData.nickname" :href="api.suspend" @click.prevent="suspend" :class="classActive(shopData.status == 1 && shopData.istrade == 1)">
                        {{istrade()}}{{getStateText()}}
                    </a>
                </li>
            </ul>
            <h4 class="otc-title ragtag">
                <span>{{lang.otc19}}</span>
                <section class="otc-menu otc-ad-btn">
                    <a href="javascript:;" @click.prevent="adState = true">{{lang.otc20}}</a>
                </section>
            </h4>
            <list class="otc-table shop-table" :url="api.pendlist" :param="listParam">
                <dl slot="head">
                    <dd>ID </dd>
                    <dd>{{lang.time}} </dd>
                    <dd>{{lang.type}}/{{lang.currency}}</dd>
                    <dd>{{lang.otcTrade}}{{lang.price}}</dd>
                    <dd>{{lang.otcTrade}}{{lang.num}}</dd>
                    <dd>{{lang.termsOfPayment}}</dd>
                    <dd>{{lang.operation}}</dd>
                </dl>
                <dl slot="body"  slot-scope="{item}" :key="item.id">
                    <dd><span class="line-feed">{{item.id}}</span></dd>
                    <dd><span class="line-feed">{{localDate(item.time)}}</span></dd>
                    <dd :class="item.type == 1 ? 'buyColor' : 'sellColor'">{{item.type == 1 ? lang.buy : lang.sell}}/ {{upperCase(item.symbol)}}</dd>
                    <dd>{{rmbDecimals(item.price)}} CNY</dd>
                    <dd>{{numDecimals(item.amount)}}</dd>
                    <dd>
                        <i class="pay-icon" v-if="item.paytype_bank == 1"></i>
                        <i class="pay-icon aliPay" v-if="item.paytype_alipay == 1"></i>
                        <i class="pay-icon weChat" v-if="item.paytype_wx == 1"></i>
                    </dd>
                    <dd>
                        <a href="javascript:;" class="otc-btn" @click="withdraw(item)">{{lang.annul}}{{item.state == 1 ? '...' : ''}}</a>
                    </dd>
                </dl>
            </list>
        </section>
        <ad @closeAd="closeAd" v-if="adState"/>
    </section>
</template>

<script>
    import ad from './ad'
    export default {
        name: "shop",
        components : {ad},
        data (){
            return {
                adState : false,
                upList : 1,
            };
        },
        watch : {
            shopData (n, o){
                if(this.loginInfo.uid && this.loginInfo.uid * 1 > 0){
                    if(!this.shopData.nickname){
                        this.$router.push('./index');
                    }else{
                        if(!o.nickname){
                            this.upList = this.upList + 1;
                        };
                    };
                }else{
                    this.toLogin();
                };
            },
            loginInfo (n, o){
                if(n && n.uid){

                }else{
                    this.toLogin();
                };
            }
        },
        created (){
            if(this.loginInfo.uid == '' || this.loginInfo.uid * 1 <= 0){
                this.toLogin();
            };
        },
        computed : {
            listParam (){
                return {
                    status : this.$route.params.type || 0,
                    currPage : this.$route.params.page || 1,
                    userid : this.loginInfo.uid || '',
                    upList : this.upList
                };
            }
        },
        methods : {
            closeAd (){
                this.adState = false;
                this.upList = this.upList + 1;
            },
            istrade (){
                return this.shopData.status != 1 ? this.lang.otc21 : this.shopData.istrade == 1 ? this.lang.otc22 : this.lang.otc23
            },
            suspend (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.shopData.status != 1){
                    this.$store.commit('msg/err', this.lang.otc24);
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.suspend,
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.istrade() + this.lang.success + '。');
                    this.$store.commit('shopDataUpdate');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.istrade() + this.lang.defeated + '！');
                    console.log(err);
                });
            },
            withdraw (item){
                this.axios({
                    url : this.api.withdraw,
                    data : {
                        order_id : item.id
                    },
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang.annulS);
                    this.$store.commit('shopDataUpdate');
                    this.upList = this.upList + 1;
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang.annulE);
                    console.log(err);
                });
            },
        }
    }
</script>

<style scoped>

</style>
