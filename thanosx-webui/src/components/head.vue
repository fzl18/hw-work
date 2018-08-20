<template>
<!-- <Affix offset-top="100" @on-change="change">   -->
    <section class="tophead">
        <header :class=" active == 'trade' ? 'trade' : 'container' ">
            <div>
                <div style="width:75%;float:left;">                    
                    <div class="logo"><a href="/" ></a> </div>
                    <div class="lang">
                        <Dropdown @on-click="changeLang">
                            <a href="javascript:void(0)">
                                <template v-for=" curlang in lang.type">
                                    {{local == curlang.val ? curlang.title : null }}
                                </template>
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <template v-for=" curlang in  lang.type">
                                    <DropdownItem :name="curlang.val">{{curlang.title}}</DropdownItem>
                                </template>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div class="nav" v-for="nav in menu" >
                        <a href="" :class=" active == nav && 'cur' " @click.stop.prevent="toModule(nav)">{{lang[local][nav]}}</a>
                    </div>                         
                </div>
                <div style="width:25%;float:right">
                    <div v-if="!loginStatus && loginGetStatus " class="login">
                        <a href="" class="cur" @click.prevent="toLogin()">{{lang[local].login }}</a>
                        <a href="" @click.prevent="toRegister()">{{lang[local].freeRegister }}</a>
                    </div>
                    <div v-if="loginGetStatus && loginStatus " class="login">
                        <div class="login-name" @click="taphandle">
                               <i class="iconfont icon-yonghu-yuan" style="font-size:20px;margin-left:15px;"></i>
                                <span>{{loginInfo.username.slice(0,15) }}{{loginInfo.username.length > 15 ? '...':''}}</span>
                            <ul :style="isMobile ? isShow ?'display:block':'display:none;':'' ">
                                <li>UID：{{loginInfo.uid}}</li>
                                <li @click="goto(financeUrl)">{{lang[local].mymoney}}<!-- <a :href="" style="float:right;color:#FF6500;">{{lang[local].view}}</a>--> </li>
                                <li @click="goto()"><span style="float:left;color:inherit;font-weight:normal">{{lang[local].accountSetting}}</span><a :href="financeUrl+'/account'"><span class="state" :style="local =='en'? 'font-size:12px':'' ">{{ loginInfo && loginInfo.nameauthstatus==1 ? lang[local].certified : loginInfo && loginInfo.nameauthstatus == 0 ? lang[local].nameauthstatus2 : loginInfo && loginInfo.nameauthstatus == 2 ? lang[local].nameAuth31 : lang[local].unauthorized }}</span> </a></li>
                                <li @click="logout" class="exit"> <i class="iconfont icon-tuichu1"></i> {{lang[local].loginExit}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </section>
<!-- </Affix> -->
</template>

<script>
    import {mapState} from "vuex";
    import {toUrl} from "../common/api/api";
    export default {
        name : "tophead",
        props : ['active'],
        data (){
            return {
                menu : ['home', 'trade', 'whitebook','ico', 'app'], // 'ico'
                loginTo : ['safety', 'finance'],
                isShow:false,
                isMobile:false,
            };
        },
        watch : {
            "loginInfo" (n, o){
                if(!(n && n.uid)){
                    this.loginTo.forEach((n) => {
                        if(this.active == n){
                            this.toLogin();
                        };
                    });
                };
            },
        },
        computed : {
            ...mapState('login',['loginInfo','loginStatus','loginGetStatus'])
        },
        created (){
            this.getLoginInfo()
            // if(typeof userData == 'object'){
            //     if(userData.uid){
            //         this.$store.commit('login/loginInfo', userData);
            //         this.$store.commit('login/loginStatus', true);
            //         this.$store.commit('login/loginGetStatus', true);
            //     }else{
            //         if(typeof this.getLoginInfo == 'function'){
            //             this.getLoginInfo();
            //         };
            //     };
            // }else{
            //     if(typeof this.getLoginInfo == 'function'){
            //         this.getLoginInfo();
            //     };
            // };
            this.$store.commit('headerActive', this.active);
        },
        mounted(){
            document.title = this.lang[this.local].htmlTitle || ''
            this.isphone()
            this.comeFrom()
        },
        methods : {
            changeLang(lang){
                this.$store.commit('changeLang', lang);
                document.title = this.lang[this.local].htmlTitle || ''
            },
            isphone() {
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            this.isMobile = (flag && flag.length) >0 ? true : false
            },
            taphandle(){
                if(this.isMobile){
                    this.isShow = !this.isShow
                }                
            },
            toUrl (item){                
                if(process.env.NODE_ENV == 'development'){
                    // if(item == 'whitebook'){
                    //     return '/public/static/white_paper.pdf';
                    // };
                    return '/' + (item == 'home' ? 'index' : item) + '.html';
                }else{
                    // if(item == 'whitebook'){
                    //     return '/public/static/white_paper.pdf';
                    // };
                    
                    return '/home/' + (item == 'home' ? 'index' : item);
                }
                
            },
            toModule (item){
                if(this.loginTo.indexOf(item) >= 0 && !this.loginInfo.uid){
                    this.toLogin(this.toUrl(item));
                }else{
                    if(item == 'app'){
                        if(this.active == 'home'){
                            let anchorElement = document.getElementById('app');
                            if(anchorElement) { anchorElement.scrollIntoView(); }
                            return
                        }else{
                            location.href = process.env.NODE_ENV != 'development' ? '/home/index?#app' : '/index.html?#app'
                        }
                        return
                    }

                    if(item == 'whitebook'){
                        if(this.local =='zh'){
                            window.open('/static/white_paper_cn.pdf')
                        }else if(this.local =='zhtw'){
                            window.open('/static/white_paper_tw.pdf')
                        }else{
                            window.open('/static/white_paper_en.pdf')
                        }                        
                        return
                    }

                    location.href = this.toUrl(item);
                };
            },
            logout (){
                this.axios({
                    url : this.api.logout,
                }).then((res) => {
                    this.loginStatus = false;
                    if(this.active == 'home'){
                        location.reload();
                    }else{
                        location.href = this.loginUrl;
                    };
                }).catch((err) => {
                    console.log(err);
                    location.reload();
                });
            }, 
            goto(url){
                if(url){
                    location.href = this.financeUrl;
                }else{
                    location.href = this.financeUrl + '/account'
                }
            },
            comeFrom (){
                this.axios({
                    url : this.api.ipfrom,
                }).then((res) => {

                    if(this.$router.history.base == toUrl.indexUrl && this.$router.history.current.name =="prohibit"){
                        return false
                    }
                    if(res.data.status != "success"){
                        // this.$store.commit('ip', res.data.ip)
                        // this.$store.commit('county', res.data.county)
                        // this.$router.push('/prohibit')
                        location.href = toUrl.indexUrl + '/prohibit'
                    }
                    
                }).catch((err) => {
                    // location.reload();
                });
            },
        },
    }
</script>

