<template>
    <section>
        <financeHeader>
            <span>{{lang[local].mapTitle}}</span>
        </financeHeader>
        <section class="finance-hint" v-if="hand">
            您正在进行DEL主网映射操作, 按照 <a href="https://www.rdb.one/home/article/72/54" target="_blank">手动映射DEL教程</a> 生成DEL钱包地址，请务必妥善保存您的私钥，丢失私钥则资产无法找回。
        </section>
        <section class="finance-coin">
            <balance v-model="balance" :coin="coin" />

            <section class="finance-hint" style="margin-top: 70px;" v-if="!hand">
                你现在是
                <span class="mainColor">自动映射模式</span>，
                DEL主网上线时会自动帮您映射到DEL在线钱包，并且为股东提供节点托管、在线钱包自动选举等服务；专业用户推荐
                <a href="javascript:;" class="buyColor" @click="hand = true">手动映射</a>
            </section>

            <section class="finance-form" style="min-height: auto;" v-if="!hand">
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="hand = true" class="form-submit-btn">手动映射</a>
                </section>
            </section>

            <section class="takeCoin" v-if="balance.state && hand">
                <section class="takeCoin-form finance-form" style="padding-top: 10px;">
                    <section class="form-group" v-if="addr">
                        <label>映射地址</label>
                        <!--<input type="text" v-model="param.name" :placeholder="lang[local].bankName" />-->
                        <section class="text">
                            <span style="line-height: 1.6;display: block;">{{addr}}</span>
                        </section>
                    </section>
                    <section class="form-group">
                        <label>{{lang[local].walletUrl}}</label>
                        <input name="map-Del" type="text" v-model="mapDel" :placeholder="lang[local].walletUrl" />
                        <p class="form-remark">不填改为自动映射</p>
                    </section>
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="submitMapDel" class="form-submit-btn">{{addr ? '修改' : ''}}{{lang[local].map}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    </section>
                </section>
                <section class="takeCoin-text" style="margin-top: 0;">
                    <h4>操作必读：</h4>
                    <p>1、DEL钱包映射操作推荐<span class="mainColor">专业用户</span>使用，如果您不清楚自己在做什么，请不要操作；</p>
                    <p>2、<span class="mainColor">您不进行映射，我们会在DEL主网上线时自动帮您映射到DEL在线钱包，并且为股东提供节点托管、在线钱包自动选举服务；</span></p>
                    <p>3、如果您进行了手动映射，请务必妥善保存私钥，丢失无法找回，并且您需要自行通过本地钱包进行DPOS选举<span class="mainColor">(包括股东)</span>；</p>
                    <p>4、由于手动映射后<span class="mainColor">私钥丢失导致的资产损失，我们将无法提供援助服务。</span></p>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "take-coin",
        data (){
            return {
                balance : {},
                addr : '',
                mapDel : '',
                hand : false,
            }
        },
        computed : {
        },
        watch : {
            balance (n, o){
                if(n.state == 2){
                    this.$router.push('./index');
                };
            },
            coin (n, o){
            },
        },
        created (){
            this.coinChange();
            this.getAddr();
        },
        beforeRouteUpdate (to, from ,next){
            next();
            this.coinChange();
        },
        methods : {
            getAddr (){
                this.axios({
                    url : this.api.delKey,
                    data : {
                        type : 'get'
                    },
                }).then((res) => {
                    this.addr = res.data.addr;
                    if(res.data.addr){
                        this.hand = true;
                    }else{
                        this.hand = false;
                    }
                }).catch((err) => {
                    this.addr = '';
                });
            },
            submitMapDel (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                var {mapDel} = this;
                this.getStart();
                this.axios({
                    url : this.api.delKey,
                    data : {
                        addr : mapDel,
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[local].mapS);
                    // this.$router.push('./index');
                    this.mapDel = '';
                    this.getAddr();
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[local].mapE);
                });
            },
        }
    }
</script>

