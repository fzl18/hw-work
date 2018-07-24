<template>
    <section class="home-box main-box ico">
        <header-component active="ico" />
        <div class="banner">
            <div class="container">
                <div class="txt"><i class="iconfont iconfont icon-logo"></i> <br /><b> <span>币币</span>市场</b>  </div>
                <ul>
                    <li class="cur">
                        <p class="tit">50ETH</p>
                        <p class="num">25,000 TNSX <br/> <span>赠1,500 TNSX</span></p>
                        <p class="progress"><span class="bar" style="width: 20%;"></span></p>
                        <p class="total">共500/余1000份</p>
                    </li>
                    <li>
                        <p class="tit">50ETH</p>
                        <p class="num">25,000 TNSX <br/> <span>赠1,500 TNSX</span></p>
                        <p class="progress"><span class="bar" style="width: 100%;"></span></p>
                        <p class="total">共500/余1000份</p>
                    </li>
                    <li>
                        <p class="tit">50ETH</p>
                        <p class="num">25,000 TNSX <br/> <span>赠1,500 TNSX</span></p>
                        <p class="progress"><span class="bar" style="width: 70%;"></span></p>
                        <p class="total">共500/余1000份</p>
                    </li>
                    <li>
                        <p class="tit">50ETH</p>
                        <p class="num">25,000 TNSX <br/> <span>赠1,500 TNSX</span></p>
                        <p class="progress"><span class="bar" style="width: 30%;"></span></p>
                        <p class="total">共500/余1000份</p>
                    </li>
                    <li>
                        <p class="tit">50ETH</p>
                        <p class="num">25,000 TNSX <br/> <span>赠1,500 TNSX</span></p>
                        <p class="progress"><span class="bar" style="width: 80%;"></span></p>
                        <p class="total">共500/余1000份</p>
                    </li>
                </ul>
                
            </div>            
        </div>
        <section class="from ">
            <div class="container">
                <div class="ctx">
                    <div class="input">
                        <ul>
                            <li> 数量<input type="text" placeholder=""/> <span>ETH</span> </li>
                            <li> 交易密码<input type="text" /> </li>
                            <li> 验证码<input type="text" /> <span><a href="">获取验证码</a> </span></li>
                        </ul>
                        <a href="" class="submit">{{lang[local].icoSubmit}}</a>
                    </div>
                    <div class="amount">可用：ETH    <span>可得：TNSX</span></div>                    
                </div>
                <div class="tip">
                    {{lang[local].icotip}}
                </div>               
            </div>            
        </section>
        <section class="list container">
            <div class="tit">购买记录</div>
            <list class="finance-coin-table" :url="api.loginlog" >
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
                    <dd>{{item.type}}</dd>
                    <dd>{{item.addip}}</dd>
                    <dd>{{item.addr}}</dd>
                    <dd>{{item.remark}}</dd>
                    <dd>{{item.status == 1 ? lang[local].normal : lang[local].otc21}}</dd>
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
                activeItem : {}
            }
        },
        computed : {
            ...mapState(['info'])
        },
        watch : {
            activeItem (n, o){
                this.$store.commit('activeObject', n);
            },
        },
        methods : {

        }
    }
</script>
