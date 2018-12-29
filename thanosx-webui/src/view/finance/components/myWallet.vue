<template>
    <section>
        <financeHeader>
            <span>{{lang[local].myWallet}}</span>
            <span class="addWallet" @click="addWallet" > + {{lang[local].addmyWallet}}</span>
        </financeHeader>
        <section class="myWallet-box">
        
        <section class="finance-table myWallet-table">
            <section class="head">
            <dl>
                <dd style="width:10%">{{lang[local].currency}} </dd>
                <dd style="width:65%">{{lang[local].site}}</dd>
                <dd style="width:15%">{{lang[local].walletName}}</dd>
                <dd style="width:10%">{{lang[local].operation}}</dd>
            </dl>
            </section>
            <section  v-if="getState == getStateStart">
                <load />
            </section>
            <section class="tbody">
                <dl v-for="item in listData">
                    <dd style="width:10%">{{upperCase(item.coinname)}}</dd>
                    <dd style="width:65%" :title="item.addr + '.' + item.addr_child">{{item.addr + (item.addr_child ? ('.' + item.addr_child):'')}}</dd>
                    <dd style="width:15%" :title="item.name">{{item.name}}</dd>
                    <dd style="width:10%">
                        <!-- <a href="javascript:;"><copy :val="item.addr">{{lang[local].copy}}</copy></a> <br /> -->
                        <a href="javascript:;" @click="del(item)">{{lang[local].del}}</a>
                    </dd>
                </dl>
            </section>
        </section>





            <!-- <section v-if="getState == getStateSuccess" class="item" v-for="item in listData">
                <div>
                    <i :style="{backgroundImage : 'url(' + imgUrl(item.logo) + ')'}"></i>
                    <span><b>{{upperCase(item.coinname)}}</b> {{item.coin}}</span>
                    <b>{{item.name}}</b>
                </div>
                <ul class="site">
                    <li>
                        <span :title="item.addr">{{lang[local].site}}: {{item.addr}}</span>
                        <a href="javascript:;"><copy :val="item.addr">{{lang[local].copy}}</copy></a>
                    </li>
                    <li>
                        <span v-if="item.qb_title" :title="item.addr_child">{{item.qb_title}}: {{item.addr_child}}</span>
                        <a href="javascript:;" @click="del(item)">{{lang[local].del}}</a>
                    </li>
                </ul>
            </section> -->

            <!-- <router-link to="./addWallet" tag="section" class="add">
                <span>{{lang[local].addWallet}}</span>
            </router-link> -->

        </section>
        <Modal
            v-model="isShow"
            class-name="vertical-center-modal"
            :mask-closable= "false"
            >
            <section>
                <financeHeader>
                    <span>{{lang[local].addWallet}}</span>
                </financeHeader>
                <form>
                    <section class="finance-form">
                        <section class="form-group">
                            <div class="input-box">
                            <!-- <label>{{lang[local].gu_finance43}}</label> -->
                            <i class="iconfont icon-qian"></i> 
                            <select-my class="safety-issue-select selectmy coin" style="width:90%" v-model="coinname" :list="coinList" selected="" @change="coinChange" :placeholder="lang[local].gu_finance43" :param="count"/>
                            </div>
                        </section>
                        <section class="form-group">
                            <div class="input-box">
                              <i class="iconfont icon-dizhi1"></i>   <input type="text" v-model="addr" :placeholder="lang[local].walletUrl" style="width:calc(100% - 30px)"/>
                            </div>                       
                        </section>
                        <section class="form-group" v-if="qb_title">
                            <div class="input-box">
                            <i class="iconfont icon-yuyan"></i> <input type="text" v-model="addr_child" :placeholder="qb_title" style="width:calc(100% - 80px)" />
                            </div>
                        </section>
                        <section class="form-group">
                            <div class="input-box">
                            <i class="iconfont icon-icon-"></i>  <input type="text" v-model="name" :placeholder="lang[local].walletName" style="width:calc(100% - 80px)"/>
                            </div>
                        </section>
                        <!-- <section class="form-group" style="text-align: right">
                            <div>
                                <label class="checkbox-my big">
                                    <input type="checkbox" v-model="is_default" />
                                    <i></i>
                                    {{lang[local].authWallet}}
                                </label>
                            </div>
                        </section> -->
                        <!--<section class="form-group" v-if="is_default">
                            <label>{{lang[local].payPassword}}</label>
                            <input type="password" :placeholder="lang[local].payPassword" />
                        </section>-->
                        <!-- <section class="form-group" v-if="is_default">
                            <label>{{lang[local].verifCode}}</label>
                            <input type="text" v-model="moble_verify" :placeholder="lang[local].SMSVerifCode" />
                            <span @click="sendVerify" class="getVerifCode" :class="classActive(verifyCodeTimeText == -1 || verifyCodeTimeText.length )">
                                {{
                                    verifyCodeTimeText == -1
                                    ? lang[local].getVerifCode + '...'
                                    : verifyCodeTimeText
                                    ? verifyCodeTimeText
                                    : lang[local].getVerifCode
                                }}
                            </span>
                        </section> -->
                        <section class="form-group form-group-btn">
                            <a href="javascript:;" @click="upqianbao" class="form-submit-btn">{{lang[local].gu_finance27}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                            <a href="javascript:;" @click="close" class="form-submit-btn white">{{lang[local].cancel}}</a>
                        </section>
                     
                    </section>
                </form>
            </section>
            <div slot="footer" ></div>
        </Modal>

    </section>
</template>

<script>
    export default {
        name: "my-wallet",
        data (){
            return {
                isShow:false,
                listData : [],
                coinList : [],
                is_default : false,
                sendCodeCount : 0,
                qb_title : null,
                coinname: "",
                addr :"" ,
                name :"" ,
                moble_verify : '',
                addr_child : '',
                count:0,
            };
        },
        created (){
            this.getData();            
            this.getcoinList();
        },
        methods : {
            del (item){
                this.axios({
                    url : this.api.delWallet,
                    data : {
                        id : item.id
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang[this.local].finance30);
                    this.getData();
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang[this.local].finance31);
                });
            },
            getData (){
                this.getStart();
                this.listData = [];
                this.axios({
                    url : this.api.listWallet,
                }).then((res) => {
                    this.listData = res.data || [];
                    this.getSuccess();
                }).catch((err) => {
                    this.listData = [];
                    this.getError();
                    console.log(err);
                });
            },
            upqianbao (){

                if(this.getState == this.getStateStart){
                    return false;
                };
                var {is_default, moble_verify, addr, addr_child, coinname, sendCodeCount, name} = this;

                if(!coinname){
                    this.$store.commit('msg/err', this.lang[this.local].selectCoin)
                    return false;
                };
                if(!addr){
                    this.$store.commit('msg/err', this.lang[this.local].walletUrlEmpty)
                    return false;
                };
                if(!name){
                    this.$store.commit('msg/err', this.lang[this.local].walletNameEmpty)
                    return false;
                };
                if(is_default && sendCodeCount <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].sendVerifCode)
                    return false;
                };
                if(is_default && moble_verify.length != this.verifCodeLen){
                    this.$store.commit('msg/err', this.lang[this.local].enterVerifCode)
                    return false;
                };

                this.getStart();
                this.axios({
                    url : this.api.upqianbao,
                    data : {
                        is_default : is_default * 1, moble_verify, addr, addr_child, coinname, name
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/err', this.lang[this.local].addWalletSuccess);
                    this.getData();
                    this.isShow = false
                    this.addr=''
                    this.addr_child=''
                    this.coinname='' 
                    this.name=''
                    this.count++
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].addWalletError)
                });
            },
            sendVerify (){
                if(this.verifyCodeTimeText){
                    return false;
                };
                this.verifyCodeTimeText = -1;
                this.axios({
                    url : this.api.freal,
                }).then((res) => {
                    this.sendCodeCount ++;
                    this.verifyCodeDown();
                }).catch((err) => {
                    this.verifyCodeTimeText = '';
                    this.$store.commit('msg/err', err.message || this.lang[this.local].sendVerifCodeError);
                });
            },
            getcoinList (){
                this.axios({
                    url : this.api.coinList,
                }).then((res) => {
                    var data = res.data || [];
                    var coinList = [['', this.lang[this.local].selectCoin]];
                    data.forEach((q) => {
                        if(this.upperCase(q.name) == 'CNT'){
                            return;
                        };
                        coinList.push([q.name, this.upperCase(q.name), q.qb_title]);
                    });
                    this.coinList = coinList;
                }).catch((err) => {
                    console.log(err);
                });
            },
            coinChange (val,rest){
                this.qb_title = val[2];
                if(val[0]){                    
                    this.$store.commit('msg/del', this.lang[this.local].selectCoin)
                }else{
                    !rest && this.$store.commit('msg/err', this.lang[this.local].selectCoin)
                };
            },
            addWallet(){
                this.isShow = true
                this.getcoinList()
            },
            close (){
                this.isShow = false
                this.addr=''
                this.coinname='' 
                this.name=''                
                this.count++
            }
        }
    }
</script>

<style scoped lang="scss">
    .myWallet-table{
        dl{
            dd:first-child{
               width:20%;
            }
            dd:nth-child(2){
               width:40%;
            }
            dd:nth-child(3){
               width:20%;
            }
            dd:nth-child(4){
               width:20%;
            }
        }
        
    }
</style>
