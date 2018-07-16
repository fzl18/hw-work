<template>
    <section class="header-box" :class="active">
        <header class="header">
            <a href="/" class="logo" :title="lang.webName"></a>
            <section class="header-right">
                <ul class="nav">
                    <li v-for="item in nav">
                        <a :class="active == item ? 'active' : ''" :href="toUrl(item)" @click.stop.prevent="toModule(item)">{{lang[item]}}</a>
                    </li>
                </ul>
                <div class="login-out" v-if="!loginStatus && loginGetStatus">
                    <a :href="loginUrl" @click.prevent="toLogin()">{{lang.login}}</a>
                    <a :href="registerUrl" @click.prevent="toRegister()">{{lang.freeRegister}}</a>
                </div>
                <div class="login-over" v-if="loginGetStatus && loginStatus">
                    <a :href="financeUrl" class="login-name">
                        <i></i>
                        <span>{{loginInfo.username}}</span>
                    </a>
                    <a class="login-exit" @click="logout" href="javascript:;">{{lang.loginExit}}</a>
                    <!--<a :href="tradeUrl" class="trade-btn">{{lang.$toDeal}}</a>-->
                </div>
            </section>
        </header>
        <app-download></app-download>
    </section>
</template>

<script>
    export default {
        name : "header-component",
        props : ['active'],
        data (){
            return {
                nav : ['home', 'trade', 'otc', 'finance', 'safety', 'newbies'],
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
                    if(typeof this.getLoginInfo == 'function'){
                        this.getLoginInfo();
                    };
                };
            }else{
                if(typeof this.getLoginInfo == 'function'){
                    this.getLoginInfo();
                };
            };
            this.$store.commit('headerActive', this.active);
        },
        methods : {
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
            }
        },
    }
</script>

