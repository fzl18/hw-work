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
            <b class="totalAssets" :class="classActive(!totalAssetsState)"> <span>{{totalAssets}}</span></b>
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
                <Button size="large" type="primary" @click="addOrder"> 添加委托单</Button>
            </div>
        </section>
        <!-- <section class="tab_btn">
            <a href="javascript:;" :class="!cur ? 'cur' :'' " @click="hadndleTab(0)">{{lang[local].mainCoin}}</a>
            <a href="javascript:;" :class="cur ? 'cur' :'' " @click="hadndleTab(1)">{{lang[local].newCoin}}</a>
            
        </section> -->
        <list class="finance-index-table" v-if="!cur" :url="api.assets" pageSize="10" :pageStatus="false" :seek="seek">
            <dl slot="head">
                <dd>{{lang[local].currency}}</dd>
                <dd>{{lang[local].usable}}</dd>
                <dd>{{lang[local].freeze}}</dd>
                <dd>{{lang[local].lock}}</dd>
                <dd>{{lang[local].totalCurrency}}</dd>
                <dd>{{lang[local].operation}}</dd>
            </dl>            
            <dl slot="body" slot-scope="{item}">
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
                <dd>
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
                <dd>
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
                </template>
            </dl>
        </list>


        <section class="finance-table" v-if="cur">
            <section class="head">
                <dl>
                    <dd style="width:20%">{{lang[local].currency}}</dd>
                    <dd style="width:20%">{{lang[local].usable}}</dd>
                    <dd style="width:20%">{{lang[local].freeze}}</dd>
                    <dd style="width:20%">{{lang[local].totalCurrency}}</dd>
                    <dd style="width:20%">{{lang[local].operation}}</dd>
                </dl> 
            </section>
            <section class="tbody">
                <dl v-for="item in accountListArrary">
                        <dd style="width:20%">
                            <span>
                                {{item.coin.toUpperCase()}}
                            </span>
                        </dd>
                        <dd style="width:20%">
                            <span>
                                {{item.available}}
                            </span>
                        </dd>
                        <dd style="width:20%">
                            <span>
                                {{item.frozen}}
                            </span>
                        </dd>
                        <dd style="width:20%">
                            <span>
                                {{item.total}}
                            </span>
                        </dd>              
                        <dd style="width:20%">
                            <Button size="large" type="text" @click="handleTransfer(item.coin,item.tran_available,'in')">{{lang[local].transferIn}}</Button>
                            <Button size="large" type="text" @click="handleTransfer(item.coin,item.available,'out')">{{lang[local].transfer}}</Button>
                        </dd>
                </dl>
            </section>
            <!-- <page :page="page" @pageChange="pageChange" /> -->
        </section>


        <Modal
            v-model="addOrderModal"
            :closable = false
            :footer-hide = true
            width="1000"
            class-name="vertical-center-modal">
            
            <addOrder @ok="ok" @close="close" :url="api.basicCoin" :params="transferInfoOB"/>
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
                    <td align="right">{{transferCoin}}</td>
                </tr>
                <tr>
                    <td>数量</td>
                    <td align="right"><InputNumber :min="0" :max="availableCoin" v-model="transferAmount" size="large" style="width:50%"/></td>
                </tr>
                <tr>
                    <td>{{transferType == 'in' ? '交易账户':'C2C账户'}}</td>
                    <td align="right">可用：<span style="font-weight:bold">{{availableCoin}} {{transferCoin}}</span> </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row>
                            <Col span="12"><Button type="primary" size="large" @click="assetsTransfer">确认</Button></Col>                
                            <Col span="6" offset="6"><Button type="text" size="large" @click="assetsTransferClose">取消</Button></Col>
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
                transferType:'',
                accountListArrary:[],
                transferCoin:'',
                availableCoin:0,
                transferAmount:null,
                transferInfoOB:{}
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
            // this.accountList()
        },
        mounted(){
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
                if(!index){
                    this.myasset()
                }else{
                    this.accountList()
                }
            },
            getMainCoins(){
                this.axios({
                    url : this.api.getMainCoins,
                    data : {
                    }
                }).then(res => {
                    this.mainChain = res.data
                }).catch()
            },
            accountList(){
                this.axios({
                    url : this.api.accountList,
                    data : {
                        
                    }
                }).then(res => {
                    this.accountListArrary = res.data.list
                    this.totalAssets = res.data.usdt
                }).catch(err=>{
                    console.log(err)
                })
            },
            addOrder(){
                this.transferInfo()
                this.addOrderModal = true
            },
            ok(val){
                let bank_pay = 0, wx_pay = 0, ali_pay = 0
                val.payment.map(d=>{
                    switch (d) {
                        case '1':
                            bank_pay = 1
                            break;
                        case '2':
                            ali_pay = 1
                            break;
                        case '3':
                            wx_pay = 1
                            break;
                    
                        default:
                            break;
                    }
                })
                let playload = {
                    "coin": val.coin,
                    "amount": val.count,
                    "price": val.price,
                    "type": val.type,
                    "currency": val.currency,
                    bank_pay,
                    wx_pay,
                    ali_pay,
                    "min": val.min,
                    "max": val.max,
                    "remark": val.note
                }
                console.log(playload)                
                this.axios({
                    url : this.api.createPend,
                    data : {
                        ...playload
                    }
                }).then(res => {                    
                    this.addOrderModal = false
                    this.$store.commit('msg/add', res.message)
                }).catch(err=>{
                    console.log(err)
                })                
                
            },
            close(){
                this.addOrderModal = false
            },
            handleTransfer(coin,available,val){
                this.transferType = val
                this.transfer = true
                this.transferCoin = coin.toUpperCase()
                this.availableCoin = available
            },
            assetsTransferClose(){
                this.transfer = false
                this.transferAmount = null
            },
            assetsTransfer(){
                this.axios({
                    url : this.api.assetsTransfer,
                    data : {
                        direction:this.transferType == 'in' ? 1 : 2,
                        count:this.transferAmount,
                        symbol:this.transferCoin.toLowerCase()
                    }
                }).then(res => {                    
                    this.accountList()
                    this.$store.commit('msg/add', res.message)
                    this.assetsTransferClose()
                }).catch(err=>{
                    console.log(err)
                })
            },
            transferInfo(){
                this.axios({
                    url : this.api.transferInfo,
                    data : {

                    }
                }).then(res=>{
                    this.transferInfoOB = res.data
                }).catch( err=>{
                    console.log(err);
                })
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
