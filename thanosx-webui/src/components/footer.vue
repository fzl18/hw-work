<template>
    <section class="footer-box">
        <footer class="footer">
            <div class="footer-logo">
                <a href="/" :title="lang.webName">
                    <img src="../assets/images/logo_white.png" :alt="lang.webName">
                </a>
            </div>
            <section class="footer-nav">
                <dl>
                    <dt><a href="javascript:;" >{{navList[0] && navList[0].name}}</a></dt>
                    <dd v-for="nav in (navList[0] && navList[0].children || [])" :key="nav.id">
                        <a :href="articleUrl + '/' + nav.id"  @click.prevent="navHref(nav)">{{nav.name}}</a>
                    </dd>
                </dl>
                <dl>
                    <dt><a href="javascript:;" >{{lang.transactionRelated}}</a></dt>
                    <dd><a :href="tradeUrl" >{{lang.trade}}</a></dd>
                    <dd><a :href="otcUrl" >{{lang.otc}}</a></dd>
                    <dd><a :href="financeUrl" >{{lang.finance}}</a></dd>
                    <dd><a :href="safetyUrl" >{{lang.safety}}</a></dd>
                    <dd><a :href="newbiesUrl" >{{lang.newbies}}</a></dd>
                </dl>
                <dl>
                    <dt><a href="javascript:;" >{{navList[1] && navList[1].name}}</a></dt>
                    <dd v-for="nav in (navList[1] && navList[1].children || [])" :key="nav.id">
                        <a :href="articleUrl + '/' + nav.id" @click.prevent="navHref(nav)">{{nav.name}}</a>
                    </dd>
                </dl>
                <dl>
                    <dt><a href="javascript:;" >{{navList[2] && navList[2].name}}</a></dt>
                    <dd v-for="nav in (navList[2] && navList[2].children || [])" :key="nav.id">
                        <a :href="articleUrl + '/' + nav.id"  @click.prevent="navHref(nav)">{{nav.name}}</a>
                    </dd>
                </dl>
                <dl>
                    <dt><a href="javascript:;" >{{lang.contactUs}}</a></dt>
                    <dd>
                        <!--<p><a href="tel:00084008888686">Phone: +0008 400-888-8686</a></p>-->
                        <p><a href="mailto:contact@rdb.one">Email: contact@rdb.one</a></p>
                        <!--<p>Add: 201 Creative St, NY NY 10021 </p>-->
                        <div class="footer-media">
                            <a class="facebook" href="https://www.facebook.com/" target="_blank" title="Facebook"></a>
                            <a class="twitter" href="https://twitter.com/" target="_blank" title="Twitter"></a>
                            <a class="instagram" href="https://www.instagram.com/" target="_blank" title="Instagram"></a>
                            <a class="youtube" href="https://www.youtube.com/" target="_blank" title="YouTube"></a>
                            <a class="google" href="https://plus.google.com/" target="_blank" title="Google+"></a>
                        </div>
                    </dd>
                </dl>
            </section>
            <section class="footer-caution">
                <p><span>{{lang.riskWarning}}：</span>{{lang.riskWarningText}}</p>
            </section>
            <section class="footer-links" v-if="linksShowStatus">
                <span>{{lang.friendshipLink}}：</span>
                <a v-for="link in links" :href="link.url" target="_blank" title="">{{link.name}}</a>
            </section>
            <section class="footer-v">
                <p>Copyright ©2018 All Rights Reserved</p>
            </section>
        </footer>
    </section>
</template>

<script>
    export default {
        name: "footer-component",
        data (){
            return {
                links : [],
                linksShowStatus : false,
                navList : [],
            };
        },
        created (){
            this.getLinks();
            this.navListArticle();
        },
        methods : {
            navHref (nav){
                if(/\/article/.test(location.href)){
                    this.$router.push('/' + nav.id);
                }else{
                    location.href = this.articleUrl + '/' + nav.id;
                }
            },
            navListArticle (){
                this.axios({
                    url : this.api.navListArticle,
                }).then((res) => {
                    var data = res.data;
                    data.forEach(item => {
                        if(item.children && item.children.length > 5){
                            item.children = item.children.splice(0, 5);
                        };
                    });
                    this.navList = res.data || [];
                }).catch((err) => {
                    console.log(err);
                });
            },
            getLinks (){
                this.axios({
                    url : this.api.getLinks,
                }).then((res) => {
                    this.links = res.data || [];
                    this.linksShowStatus = !!this.links;
                }).catch((err) => {
                    this.links = [];
                    this.linksShowStatus = false;
                });
            },
        },
    }
</script>

