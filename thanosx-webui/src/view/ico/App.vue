<template>
    <section class="home-box main-box ico">
        <header-component active="ico" />
        <div class="banner">
            <div class="container">
                <div class="txt"><i class="iconfont iconfont icon-logo"></i> <br /><b> <span>币币</span>市场</b>  </div>
                <ul >
                    <li v-for="(item , index) in list"  :class=" index == cur ?  'cur' : '' " @click="handselect(index)">
                        <p class="tit">{{item.name}}</p>
                        <p class="num"> {{item.isDefault ? `${item.pay_amount} ${item.pay_coin} = ${item.get_amount} ${item.get_coin}` : `${item.get_amount} ${item.get_coin}`}} <br/>
                        <span> <template v-if="item.get_free_amount > 0"> 赠 {{item.get_free_amount}} {{item.get_coin}}</template></span>
                        </p>
                        <p class="progress"><span class="bar" :style=" 'width:' + (item.total_count - item.last_count) / item.total_count *100 + '%'"></span></p>
                        <p class="total">共 {{item.total_count}} / 余 {{item.last_count}} 份</p>
                    </li>
                </ul>
                
            </div>            
        </div>
        <section class="from ">
            <div class="container">
                <div class="ctx">
                    <div class="input">
                        <ul>
                            <li> 数量<input type="text" v-model="num" :disabled="cur > 0 ? true : false " :style="cur > 0 && 'cursor:not-allowed' " style="text-align:right;"/> <span>{{pay_coin}}</span> </li>
                            <li> 交易密码<input type="text" v-model="pw" /> </li>
                            <li> 验证码<input type="text" v-model="verify" /> <span><a href="">获取验证码</a> </span></li>
                        </ul>
                        <a href="" class="submit">{{lang[local].icoSubmit}}</a>
                    </div>
                    <div class="amount">可用： {{pay_coin}}    <span>可得：{{getcoin}} {{get_coin}}</span></div>                    
                </div>
                <div class="tip">
                    {{lang[local].icotip}}
                </div>               
            </div>            
        </section>
        <section class="list container">
            <div class="tit">购买记录</div>
            <list class="finance-coin-table" :url="api.ico" >
                <dl slot="head">
                    <dd>{{lang[local].icotabhead1}}</dd>
                    <dd>{{lang[local].icotabhead2}}</dd>
                    <dd>{{lang[local].icotabhead3}}</dd>
                    <dd>{{lang[local].icotabhead4}}</dd>
                    <dd>{{lang[local].icotabhead5}}</dd>
                    <dd>{{lang[local].icotabhead6}}</dd>
                </dl>
                <dl slot="body" slot-scope="{item}" :key="item.id">
                    <dd>{{localDate(item.addtime)}}</dd>
                    <dd>{{item.total_count}}</dd>
                    <dd>{{item.pay_coin}}</dd>
                    <dd>{{item.pay_amount}}</dd>
                    <dd>{{item.get_free_amount}}</dd>
                    <dd>{{item.get_amount}}</dd>
                </dl>
            </list>
        </section>
        
        <load v-if="getState == getStateStart" />

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
                num:0,
                pw:'',
                get_coin:'',
                pay_coin:''
            }
        },
        computed : {
            getcoin(){
                if(this.list.length){
                     return this.cur ? (parseInt(this.list[this.cur].get_amount) + parseInt(this.list[this.cur].get_free_amount)) : this.num * parseInt(this.list[this.cur].get_amount)
                }
            },
            ...mapState(['info'])
        },

        created (){
            this.getIcoList()
        },
        methods : {
            getIcoList(){
                this.axios({
                    url : this.api.ico,
                    data : {
                    }
                }).then((res) => {
                    this.list = res.data || [];
                    this.get_coin = res.data[0].get_coin
                    this.pay_coin = res.data[0].pay_coin
                }).catch((err) => {
                    this.list = [];
                    this.showStatus = false;
                });
            },
            handselect(index){
                this.cur = index                
                this.num = index && this.list[index].pay_amount
            }
        }
    }
</script>
