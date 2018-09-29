<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].myAssets}}</span>
        </financeHeader>
        <!-- <section class="finance-hint" v-if="loginStatus && !loginInfo.truename">
            {{lang[local].nameAuth30}}
        </section> -->
        <section class="tab_btn">
            <a href="javascript:;" :class="!cur ? 'cur' :'' " @click="hadndleTab(0)">{{lang[local].transferAccount}}</a>
            <a href="javascript:;" :class="cur ? 'cur' :'' " @click="hadndleTab(1)">{{lang[local].c2cAccount}}</a>
        </section>
        <section class="amount">
            <span>{{lang[local].totalAssets}}：</span>
            <b class="totalAssets" :class="classActive(!totalAssetsState)"> <span>{{ totalAssets}}</span></b>
            <span style="font-size:13px;padding:3px 10px;display:inline-block;background:#999;color:#fff;line-height:20px;border-radius: 15px;">USDT</span>
            <div class="filter" v-if="!cur">
                <!-- <span @click=" isChecked = !isChecked "> <i class="iconfont" :class=" isChecked ? 'icon-icon2' : 'icon-huisekuang'"></i> {{lang[local].filter}}</span> -->
                <i-switch v-model="isChecked" size="large" >
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                {{lang[local].filter}}
            </div>
            <div class="filter" v-if="cur">
                <Button size="large" type="primary" @click="addOrderModal = true"> 添加委托单</Button>
            </div>
        </section>
        <!-- <section class="tab_btn">
            <a href="javascript:;" :class="!cur ? 'cur' :'' " @click="hadndleTab(0)">{{lang[local].mainCoin}}</a>
            <a href="javascript:;" :class="cur ? 'cur' :'' " @click="hadndleTab(1)">{{lang[local].newCoin}}</a>
            
        </section> -->
        <list class="finance-index-table" :url="api.assets" pageSize="100" :pageStatus="false" :seek="seek">
            <dl slot="head">
                <dd>{{lang[local].currency}}</dd>
                <dd>{{lang[local].usable}}</dd>
                <dd>{{lang[local].freeze}}</dd>
                <dd v-if="!cur">{{lang[local].lock}}</dd>
                <dd>{{lang[local].totalCurrency}}</dd>
                <dd :style=" cur ? 'width:36%':''">{{lang[local].operation}}</dd>
            </dl>            
            <dl slot="body" slot-scope="{item}"  v-if=" !cur ?  mainChain.indexOf(item.market2.toLowerCase()) != -1 : mainChain.indexOf(item.market2.toLowerCase()) == -1" >
                <template v-if=" isChecked ? item.total > 0 : true ">
                <dd>
                    <span>
                        <b>{{upperCase(item.market2)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <!-- <b>{{numDecimals(item.available)}}</b> -->
                        <b>{{tobigNumber(item.available)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{tobigNumber(item.availabled)}}</b>
                    </span>
                </dd>
                <dd v-if="!cur">
                    <span>
                        <b>{{tobigNumber(item.availablelock)}}</b>
                    </span>
                </dd>
                <dd>
                    <span>
                        <b>{{tobigNumber(item.total)}}</b>
                        <!-- <small>≈¥{{rmbDecimals(item.total_cny)}}</small> -->
                    </span>
                </dd>
                <dd v-if="!cur">
                    <router-link :class="item.zr_jz != 1 ? 'disabled' : ''" :to="item.zr_jz != 1 ? '' : './pushCoin?coin=' + item.market2">
                        {{lang[local].pushCoin}}
                    </router-link>
                    <router-link :class="item.zc_jz != 1 ? 'disabled' : ''" :to="item.zc_jz != 1 ? '' : './takeCoin?coin=' + item.market2">
                        {{lang[local].takeCoin}}
                    </router-link>
                    <!-- <router-link :class="upperCase(item.zcother_jz) != 1 ? 'disabled' : ''" :to="upperCase(item.zcother_jz) != 1 ? '' : './transferCoin?coin=' + item.market2">
                        {{lang[local].transferCoin}}
                    </router-link> -->
                </dd>
                <dd v-if="cur" style="width:36%">
                    <Button size="large" type="text" @click="handleTransfer('in')">{{lang[local].transferIn}}</Button>
                    <Button size="large" type="text" @click="handleTransfer('out')">{{lang[local].transfer}}</Button>
                </dd>
                </template>
            </dl>
        </list>
        <Modal
            v-model="addOrderModal"
            :closable = false
            :footer-hide = true
            width="1000"
            class-name="vertical-center-modal">
            
            <addOrder @ok="ok" @close="close"/>
        </Modal>
        <Modal
            v-model="transfer"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{transferType == 'in' ? '转入至C2C账户':'转出至交易账户'}}</h1>
            <table>
                <tr>
                    <td width="80">币种</td>
                    <td align="right">ETH</td>
                </tr>
                <tr>
                    <td>数量</td>
                    <td align="right"><InputNumber size="large" style="width:50%"/></td>
                </tr>
                <tr>
                    <td>交易账户</td>
                    <td align="right">可用：<span style="font-weight:bold">1000000000 ETH</span> </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row>
                            <Col span="12"><Button type="primary" size="large" @click="transfer=false">确认</Button></Col>
                            <Col span="6" offset="6"><Button type="text" size="large" @click="transfer=false">取消</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
    </section>
</template>

<script>
    import bigNum from "bignumber.js"
    export default {
        name: "index",
        data (){
            return {
                mainChain:[],
                isChecked:false,
                cur:0,
                market2 : '',
                totalAssets : 0,
                coinSeekSatet : false,
                totalAssetsState : false,
                origin : process.env.NODE_ENV == 'development' ? 'http://47.99.115.225' : '',
                addOrderModal:false,
                transfer:false,
                transferType:''
            };
        },
        watch : {
        },
        computed : {
            seek (){
                return {market2 : this.market2};
            },
            // ismain (){
            //     return  this.mainChain.indexOf(this.item.market2) == -1
            // }
            
        },
        created (){
            this.myasset()
            this.getMainCoins()
        },
        mounted(){
            console.log(this.mainChain)
        },
        methods : {
            tobigNumber(val){
                return bigNum(val).toString(10)
            },
            myasset (){
                this.axios({
                    url : this.api.myasset,
                }).then((res) => {
                    this.totalAssets = res.data.tol || 0;
                }).catch((err) => {
                    console.log(err);
                });
            },
            hadndleTab (index){
                this.cur = index
            },
            getMainCoins(){
                this.axios({
                    url : this.api.getMainCoins,
                    data : {
                    }
                }).then(res => {
                    this.mainChain = res.data
                    console.log(res.data)
                }).catch()
            },
            ok(){
                this.addOrderModal = false
            },
            close(){
                this.addOrderModal = false
            },
            handleTransfer(val){
                this.transferType = val
                this.transfer = true
            }
        },
    }
</script>

<style lang="scss" scoped>
    .vertical-center-modal{
        table{
            width:100%;font-size:15px;margin:20px 0;
            td{
                height:50px;
                line-height: 50px;
            }
            tr:last-child{
                td{
                    padding-top:50px
                }
            }
        }
    }
    
</style>
