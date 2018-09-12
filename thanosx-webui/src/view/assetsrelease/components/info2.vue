<template>
    <div>
        <section class="aa_popup w-100 h-100 position-fixed">
              <div class="aa_popup_screen bg-white shadow">
                   <a class="aa_popup_close d-block" href="#"><span></span></a>
                   <div class="aa_popup_top position-relative">
                        <img class="" src="images/aa_popup_top.jpg"  width="100%">
                        <div class="aa_popup_items">
                             <div class="aa_popup_items_child" >時間    </div>
                             <div class="aa_popup_items_child">發行幣種</div>
                             <div class="aa_popup_items_child">支付數量</div>
                             <div class="aa_popup_items_child">兌換比例</div>
                             <div class="aa_popup_items_child">獲取數量</div>                   
                        </div>
                   </div>
                   <div class="aa_scrollBar position-absolute">
                        <a class="aa_scroll d-block" href="#"></a>
                   </div>
                   <div class="aa_popup_cont position-relative">                        
                        <div class="aa_popup_cont_scroll w-100 h-100 position-relative">
                        
                           <!-- 測試用數據 div -->                        
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180831</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">           2,000,000,000</div>
                                  <div class="aa_popup_field_child">                   1:300</div>                            
                                  <div class="aa_popup_field_child">             500,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">               20180827</div>
                                  <div class="aa_popup_field_child">                  ETHIO</div>
                                  <div class="aa_popup_field_child">            168,000,000</div>
                                  <div class="aa_popup_field_child">                   1:20</div>                            
                                  <div class="aa_popup_field_child">             20,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180822</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">             300,000,000</div>
                                  <div class="aa_popup_field_child">                     1:2</div>                            
                                  <div class="aa_popup_field_child">              30,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180814</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">           2,000,000,000</div>
                                  <div class="aa_popup_field_child">                   1:300</div>                            
                                  <div class="aa_popup_field_child">             500,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180809</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">           2,000,000,000</div>
                                  <div class="aa_popup_field_child">                   1:300</div>                            
                                  <div class="aa_popup_field_child">             500,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180802</div>
                                  <div class="aa_popup_field_child">                   ETHIO</div>
                                  <div class="aa_popup_field_child">             168,000,000</div>
                                  <div class="aa_popup_field_child">                    1:20</div>                            
                                  <div class="aa_popup_field_child">              20,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180728</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">             300,000,000</div>
                                  <div class="aa_popup_field_child">                     1:2</div>                            
                                  <div class="aa_popup_field_child">              30,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180723</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">           2,000,000,000</div>
                                  <div class="aa_popup_field_child">                   1:300</div>                            
                                  <div class="aa_popup_field_child">             500,000,000</div>                   
                             </div>
                              <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180722</div>
                                  <div class="aa_popup_field_child">                   ETHIO</div>
                                  <div class="aa_popup_field_child">             168,000,000</div>
                                  <div class="aa_popup_field_child">                    1:20</div>                            
                                  <div class="aa_popup_field_child">              20,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180715</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">             300,000,000</div>
                                  <div class="aa_popup_field_child">                     1:2</div>                            
                                  <div class="aa_popup_field_child">              30,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                20180708</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">           2,000,000,000</div>
                                  <div class="aa_popup_field_child">                   1:300</div>                            
                                  <div class="aa_popup_field_child">             500,000,000</div>                   
                             </div>
                              <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                201800705</div>
                                  <div class="aa_popup_field_child">                   ETHIO</div>
                                  <div class="aa_popup_field_child">             168,000,000</div>
                                  <div class="aa_popup_field_child">                    1:20</div>                            
                                  <div class="aa_popup_field_child">              20,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                201800704</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">             300,000,000</div>
                                  <div class="aa_popup_field_child">                     1:2</div>                            
                                  <div class="aa_popup_field_child">              30,000,000</div>                   
                             </div>
                             <div class="aa_popup_field">
                                  <div class="aa_popup_field_child">                201800701</div>
                                  <div class="aa_popup_field_child">                     ETH</div>
                                  <div class="aa_popup_field_child">           2,000,000,000</div>
                                  <div class="aa_popup_field_child">                   1:300</div>                            
                                  <div class="aa_popup_field_child">  500,000,000</div>                   
                             </div>
                             
                           <!-- 測試用數據 div 結束--> 
                            
                             <div class="aa_popup_field_end text-center">以下暫無資料</div>
                        </div>          
                   </div>                   
              </div>
              <div class="aa_popup_bg position-fixed w-100 h-100"></div>
         
         </section>

         <section class="aa_indexWrap position-relative w-100 m-0 p-0">
              <div class="aa_videoWrap position-fixed w-100 h-100 m-0 p-0">
                   <video class="video_bg position-absolute" preload="auto" autoplay loop muted="muted" >
                        <source src="video/star.mp4" type="video/mp4">
                   </video> 
                   <div class="aa_videoBg w-100 h-100"> </div>                                  
              </div>
              <main class="container-fluid m-0 position-relative aa_main">
                   <div class="container">
                       <div class="aa_main_top position-relative">
                            <a class="aa_logo text-hide d-block" href="#" target="_blank"><img class="" src="images/aa_logo.png" width="100%">logo</a>
                            <div class="aa_file_list d-block"><span>TNSX</span>-20180827</div>
                       </div>
                       <div class="aa_main_top_bn position-relative">
                            2018<span class="mx-2">/</span>8<span class="mx-2">/</span>27<span class="mx-2">/</span>16:00
                            <div class="aa_main_top_bn_line"><img class="" src="images/aa_light.png" width="100%"></div>
                            <p>即將開始</p>
                       </div>
                   </div>
                   <div class="aa_main_cont position-relative container-fluid mX-0 pX-0">
                        <div class="container aa_main_cont_bg position-relative">
                             <div class="aa_main_cont_top position-relative">
                                  <h2>ThanosX平台币代码为TNSX，采用“交易即挖矿”模式，发行量为100亿枚，且永不增发。</h2>
                                  <p>【TNSX初始分配】社区回馈：51%；生态投资：21%；团队持有：10% ；战略投资：8%；数字资产发行：5%；策略合作：5%。
                                  【TNSX 持有者权利】1. 数字资产返还：ThanosX平台80%的手续费将按照TNSX持有比例进行返还，剩余20%用于平台运营及研发。
                                  2. 参与决策权：ThanosX社区完全采用自治的形式，各项事务由TNSX持有者进行投票，使所有TNSX参与到社区的治理当中。</p>
                                  
                                  <p>另外，每日产生的交易手续费再折算成TNSX发放给交易用户。 ThanosX预计总发行100亿枚TNSX，其中500,
                                  000,000枚为数字资产发行。本兑换一共分为六期，本期预计发行100,000,000枚TNSX，约为2941颗ETH。 </p>
                             </div>
                             <div class="aa_main_cont_middle position-relative mt-5">
                                  <p>發&ensp;行&ensp;方： <span>ThanosX </span>                                  </p>              
                                  <p>官網地址： <a class="" href="#" target="_blank">https://www.thanosx.com</a>             </p>
                                  <p>本次發行：100000000 / 餘 100000000                    </p>
                                  <p>發行時間：2018-08-27 16:00:00 ~2018-09-01 00:00:00  </p> 
                                  <p class="aa_price_screen">參考價位：<a href="#" class="aa_price mx-3">1 ETH = 34000 TNSX</a>
                                             <a href="#" class="aa_price mx-3">1 ETH = 34000 TNSX</a>
                                             <a href="#" class="aa_price mx-3">1 ETH = 34000 TNSX</a>
                                  </p>
                                  <p class="aa_price_screen"><span>參考價位：</span><a href="#" class="aa_price mx-3">1 ETH = 34000 TNSX</a>
                                             <a href="#" class="aa_price mx-3">1 ETH = 34000 TNSX</a>
                                             <a href="#" class="aa_price mx-3">1 ETH = 34000 TNSX</a>
                                  </p>    
                             </div>
                             <div class="aa_main_cont_middle_mobile position-relative mt-5">
                                  <p>發&ensp;行&ensp;方： <span>ThanosX </span>                                  </p>              
                                  <p>官網地址： <a class="" href="#" target="_blank">https://www.thanosx.com</a>             </p>
                                  <p>本次發行：</br> 100000000 / 餘 100000000                    </p>
                                  <p>發行時間：</br> 2018-08-27 16:00:00 ~  </br>2018-09-01 00:00:00  </p> 
                                   <p class="aa_price_screen">參考價位：
                                             </br></br><a href="#" class="aa_price">1 ETH = 34000 TNSX</a>
                                             </br><a href="#" class="aa_price">1 ETH = 34000 TNSX</a>
                                             </br><a href="#" class="aa_price">1 ETH = 34000 TNSX</a>
                                             </br><a href="#" class="aa_price">1 ETH = 34000 TNSX</a>
                                             </br><a href="#" class="aa_price">1 ETH = 34000 TNSX</a>
                                             </br><a href="#" class="aa_price">1 ETH = 34000 TNSX</a>
                                  </p>                                                                    
                             </div>
                             <div class="aa_main_cont_form position-relative">
                                  <div class="cont_form_TIT position-absolute">購買</div>
                                  <div class="cont_form_bg position-relative">
                                       <div class="cont_form_TIT position-absolute">購買</div>
                                       <form class="aa_register">
                                            <div class="aa_register_left">		
                                                <div class="aa_quantity">
                                                     <div class="aa_input_TIT position-absolute">數&ensp;&ensp;&ensp;&ensp;量：</div>
                                                     <input type="text" id="input_quantity" />
                                                     <label for="input_quantity"></label>
                                                     <div class="aa_account">
                                                         <div class="aa_accountInfo position-absolute">可用：<span id="">0</span>&ensp;ETH</div>
                                                         <div class="aa_accountObtain position-absolute">可得：<span id="">0</span></div>
                                                     </div>
                                                </div> 
                                                    
                                                <div class="aa_passwords">
                                                     <div class="aa_input_TIT position-absolute">交易密碼：</div>
                                                     <input type="password" id="input_pswords"/>
                                                     <label for="input_pswords"></label>                        
                                                </div>                   
                                                  
                                                <div class="aa_captcha">
                                                     <div class="aa_input_TIT position-absolute">驗&ensp;證&ensp;碼：</div>
                                                     <input type="text" id="input_captcha" />
                                                     <label for="input_captcha"></label>
                                                    
                                                    <!-- <div class="captchaImg" 
                                                         style="display:inline-block;width:102px;height:40px;color:white;font-size:20px;
                                                         line-height:40px;text-align:center;background-color:#cadc4a;vertical-align:top;
                                                         margin-left:7px;font-family:'Arial Black';letter-spacing: 1px;">57953
                                                     </div>   -->
                                                     <a href="#" class="captchaObtain">獲取驗證碼</a>	                  
                                                </div>
                                            </div>
                                            <div class="aa_register_right">
                                                <div class="aa_register_right_TIT"> 認購說明：</div>
                                                <p>1、認購額度：單筆最低為<span> 0.1ETH </span>，單筆最高 <span>1000ETH</span> ；
                                                     不限認購次數</p>
                                                <p>2、一旦購買完成後即無法退回，請確認後再行購買</p>
                                                <p>3、購買紀錄請至右上方”購買紀錄查詢”按鈕查詢</p>
                                            </div>	
                                            <div class="aa_register_bottom">
                                                <div class="checkAgree">
                                                          <input type="checkbox" id="agree" />
                                                          <label for="agree"><span class="aa_agree"></span> 我已閱讀並同意 </label>
                                                          <a href="#" class="aa_agreeText_link">發售協定</a>	
                                                </div>
                                                <a class="aa_btn_link" href="#" target="_blank"><span>登入&ensp;/&ensp;註冊</span></a> 
                                            </div>                   			
                                       </form>
                                       <div class="aa_btn_recorder_bg">
                                           <a class="aa_btn_recorder text-hide" href="#"><span>購買查詢</span></a>
                                       </div>
                                  </div>
                             </div>
                        </div>                  
                   </div>
              </main>
        </section>  
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
                    if( res.data.item.end_time*1000 < new Date().getTime() || res.data.item.status == '3' || res.data.item.status == '4' || res.data.item.status == '5'){
                        this.isTimeover = true
                    }
                }).catch((err) => {
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
                    this.$store.commit('msg/err', err.message);
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

