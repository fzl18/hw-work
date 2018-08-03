<template>
<!-- <Affix offset-top="100" @on-change="change">   -->
    <section class="tophead">
        <header :class=" active == 'trade' ? 'trade' : 'container' ">
            <Row>
                <Col span='18'>                    
                    <div class="logo"><a href="/" ></a> </div>
                    <div class="lang">
                        <Dropdown @on-click="changeLang">
                            <a href="javascript:void(0)">
                                <template v-for=" curlang in  lang.type">
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
                </Col>
                <Col span='6'>
                    <div v-if="!loginStatus && loginGetStatus" class="login">
                        <a href="" class="cur" @click.prevent="toLogin()">{{lang[local].login }}</a>
                        <a href="" @click.prevent="toRegister()">{{lang[local].freeRegister }}</a>
                    </div>
                    <div v-if="loginGetStatus && loginStatus" class="login">
                        <div class="login-name">
                               <i class="iconfont icon-yonghu-yuan" style="font-size:20px;margin-left:15px;"></i>
                                <span>{{loginInfo.username.slice(0,15) }}{{loginInfo.username.length > 15 && '...'}}</span>
                            <ul>
                                <li @click="goto(financeUrl)">{{lang[local].mymoney}}<!-- <a :href="" style="float:right;color:#FF6500;">{{lang[local].view}}</a>--> </li>
                                <li @click="goto()">{{lang[local].accountSetting}} <a :href="financeUrl+'/account'"><span class="state">{{loginInfo.nameauthstatus==1 ? lang[local].nameauthstatus :loginInfo.nameauthstatus == 0 ? lang[local].nameauthstatus2 : lang[local].nameauthstatus1 }}</span> </a></li>
                                <li @click="logout" class="exit"> <i class="iconfont icon-tuichu1"></i> {{lang[local].loginExit}}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>
        </header>
    </section>
<!-- </Affix> -->
</template>

<script>
    export default {
        name : "tophead",
        props : ['active'],
        data (){
            return {
                menu : ['home', 'trade', 'whitebook','ico', 'app'],
                loginTo : ['safety', 'finance'],
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
        created (){
            if(typeof userData == 'object'){
                if(userData.uid){
                    this.$store.commit('login/loginInfo', userData);
                    this.$store.commit('login/loginStatus', true);
                    this.$store.commit('login/loginGetStatus', true);
                }else{
                    // if(typeof this.getLoginInfo == 'function'){
                        this.getLoginInfo();
                    // };
                };
            }else{
                // if(typeof this.getLoginInfo == 'function'){
                    this.getLoginInfo();
                // };
            };
            this.$store.commit('headerActive', this.active);
        },
        methods : {
            changeLang(lang){
                this.$store.commit('changeLang', lang);
            },
            toUrl (item){                
                if(process.env.NODE_ENV == 'development'){
                    if(item == 'newbies'){
                        return '/article.html/49';
                    };
                    return '/' + (item == 'home' ? 'index' : item) + '.html';
                }else{
                    if(item == 'newbies'){
                        return '/home/article/49';
                    };
                    return '/home/' + (item == 'home' ? 'index' : item);
                }
                
            },
            toModule (item){
                if(this.loginTo.indexOf(item) >= 0 && !this.loginInfo.uid){
                    this.toLogin(this.toUrl(item));
                }else{
                    if(item == 'app'){
                        console.log(this.active)
                        if(this.active == 'home'){
                            let anchorElement = document.getElementById('app');
                            if(anchorElement) { anchorElement.scrollIntoView(); }
                            return
                        }else{
                            location.href = process.env.NODE_ENV != 'development' ? '/home/index?#app' : '/index.html?#app'
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
            }
        },
    }
</script>

